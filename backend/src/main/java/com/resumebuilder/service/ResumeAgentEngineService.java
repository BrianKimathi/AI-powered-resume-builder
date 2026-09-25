package com.resumebuilder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.resumebuilder.ai.GeminiLlmAgentClient;
import com.resumebuilder.ai.LlmToolDefinition;
import com.resumebuilder.dto.AgentExecutionRequest;
import com.resumebuilder.dto.AgentExecutionResponse;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ResumeAgentEngineService {

    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;
    private final GeminiLlmAgentClient geminiLlmAgentClient;

    public ResumeAgentEngineService(ResumeRepository resumeRepository, GeminiLlmAgentClient geminiLlmAgentClient) {
        this.resumeRepository = resumeRepository;
        this.objectMapper = new ObjectMapper();
        this.geminiLlmAgentClient = geminiLlmAgentClient;
    }

    @Transactional
    public AgentExecutionResponse executeAgentLoop(AgentExecutionRequest request, Long userId) {
        String instruction = request.getUserInstruction() != null ? request.getUserInstruction().trim() : "";
        String profession = request.getProfession() != null ? request.getProfession() : "General";

        // 1. Fetch active resume entity from database
        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId()).orElse(null);
        }

        ObjectNode resumeJson;
        try {
            if (resume != null && resume.getContentJson() != null && !resume.getContentJson().isEmpty()) {
                resumeJson = (ObjectNode) objectMapper.readTree(resume.getContentJson());
            } else {
                resumeJson = createDefaultResumeJson(profession);
            }
        } catch (Exception e) {
            resumeJson = createDefaultResumeJson(profession);
        }

        List<String> modifiedSections = new ArrayList<>();
        Long selectedTemplateId = resume != null ? resume.getTemplateId() : 2L;

        // 2. Define Available Agent Tools
        List<LlmToolDefinition> availableTools = List.of(
            new LlmToolDefinition("update_resume_summary", "Updates or rewrites the candidate's executive professional summary on the resume.", Map.of("text", "string")),
            new LlmToolDefinition("update_resume_skills", "Updates, adds, or categorizes technical skills, programming languages, databases, or frameworks on the resume.", Map.of("text", "string")),
            new LlmToolDefinition("add_project", "Adds a technical software or engineering project with title, techStack, bullet point description, liveUrl, and githubUrl.", Map.of("title", "string", "techStack", "string", "text", "string", "liveUrl", "string", "githubUrl", "string")),
            new LlmToolDefinition("add_experience", "Adds professional work experience with company, title, startYear, endYear, location, and bullet point achievements.", Map.of("company", "string", "title", "string", "startYear", "string", "endYear", "string", "text", "string")),
            new LlmToolDefinition("change_template", "Switches visual template layout ID (1: Classic ATS, 2: Modern Professional, 3: Executive Elite, 4: Technical Architecture).", Map.of("templateId", "number"))
        );

        // 3. Delegate to LLM Agent Client for Intent Understanding & Function Call Decision
        String systemPrompt = String.format("You are an AI Recruiter and Career Strategist for %s candidates. When the user asks to add or edit their summary, skills, technical projects (with github or live urls), work experience, or template, select the matching tool call.", profession);
        GeminiLlmAgentClient.AgentLlmDecision decision = geminiLlmAgentClient.sendPromptWithTools(
            systemPrompt, 
            instruction, 
            availableTools
        );

        // 4. Handle Decision: If 0 Tool Calls (Greeting/Question), return answer immediately without DB mutation
        if (!decision.hasToolCalls()) {
            return new AgentExecutionResponse(
                true,
                decision.getReplyText(),
                "NONE",
                null,
                selectedTemplateId,
                List.of()
            );
        }

        // 5. Handle Decision: Execute Tool Calls returned by Model
        String executedToolName = "NONE";
        for (GeminiLlmAgentClient.ToolCall call : decision.getToolCalls()) {
            executedToolName = call.getToolName();
            if ("update_resume_summary".equals(call.getToolName())) {
                String customSummary = extractTextArg(call.getArguments());
                String newSummary;
                if (customSummary != null && !customSummary.trim().isEmpty() && customSummary.length() > 15) {
                    newSummary = customSummary.trim();
                } else if ("Human Resources".equalsIgnoreCase(profession)) {
                    newSummary = "Strategic HR & Talent Acquisition Leader with 7+ years of experience directing employee lifecycle operations, Workday HRIS implementations, and workforce compliance frameworks.";
                } else {
                    newSummary = String.format("Results-driven %s professional with extensive background in optimizing operational workflows, scaling cross-functional teams, and delivering key business milestones.", profession);
                }
                resumeJson.put("summary", newSummary);
                modifiedSections.add("Professional Summary");
            } else if ("update_resume_skills".equals(call.getToolName())) {
                String customSkills = extractTextArg(call.getArguments());
                String skillsContent = (customSkills != null && !customSkills.trim().isEmpty()) ? customSkills.trim() : instruction;
                
                ArrayNode skillArray = objectMapper.createArrayNode();
                
                // Parse bulleted or multi-line skills string into distinct categories if structured
                if (skillsContent.contains("* **") || skillsContent.contains("\n* ")) {
                    String[] lines = skillsContent.split("\n");
                    int idCounter = 1;
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.startsWith("* **") && trimmed.contains(":**")) {
                            int endCat = trimmed.indexOf(":**");
                            String categoryName = trimmed.substring(4, endCat).trim();
                            String items = trimmed.substring(endCat + 3).trim();
                            ObjectNode cat = skillArray.addObject();
                            cat.put("id", idCounter++);
                            cat.put("categoryName", categoryName);
                            cat.put("items", items);
                        } else if (!trimmed.isEmpty() && !trimmed.startsWith("{")) {
                            ObjectNode cat = skillArray.addObject();
                            cat.put("id", idCounter++);
                            cat.put("categoryName", "Technical & Domain Skills");
                            cat.put("items", trimmed.replaceAll("^\\*\\s+", ""));
                        }
                    }
                }
                
                if (skillArray.isEmpty()) {
                    ObjectNode category = skillArray.addObject();
                    category.put("id", 1);
                    category.put("categoryName", "Technical & Core Skills");
                    category.put("items", skillsContent);
                }
                
                resumeJson.set("skillCategories", skillArray);
                modifiedSections.add("Skills & Technologies");
            } else if ("add_project".equals(call.getToolName())) {
                Map<String, Object> args = call.getArguments();
                String title = args.get("title") != null ? String.valueOf(args.get("title")) : "Technical Project";
                String techStack = args.get("techStack") != null ? String.valueOf(args.get("techStack")) : "Java, Python, Spring Boot, Postgres";
                String description = extractTextArg(args);
                String liveUrl = args.get("liveUrl") != null ? String.valueOf(args.get("liveUrl")) : "";
                String githubUrl = args.get("githubUrl") != null ? String.valueOf(args.get("githubUrl")) : "";

                ArrayNode projectArray;
                if (resumeJson.has("projects") && resumeJson.get("projects").isArray()) {
                    projectArray = (ArrayNode) resumeJson.get("projects");
                } else {
                    projectArray = resumeJson.putArray("projects");
                }

                ObjectNode p = projectArray.addObject();
                p.put("id", System.currentTimeMillis());
                p.put("title", title);
                p.put("architecture", techStack);
                p.put("link", !liveUrl.isEmpty() ? liveUrl : (!githubUrl.isEmpty() ? githubUrl : "Project Repository"));
                p.put("github", githubUrl);
                p.put("liveUrl", liveUrl);

                ArrayNode bullets = p.putArray("bullets");
                if (description != null && !description.trim().isEmpty()) {
                    for (String b : description.split("\n|\\.|;")) {
                        if (!b.trim().isEmpty()) bullets.add(b.trim());
                    }
                } else {
                    bullets.add("Architected and implemented high-throughput REST microservices.");
                    bullets.add("Optimized database queries and automated CI/CD deployment pipelines.");
                }

                modifiedSections.add("Technical Projects");
            } else if ("add_experience".equals(call.getToolName())) {
                Map<String, Object> args = call.getArguments();
                String company = args.get("company") != null ? String.valueOf(args.get("company")) : "Tech Enterprise";
                String roleTitle = args.get("title") != null ? String.valueOf(args.get("title")) : profession + " Engineer";
                String startYear = args.get("startYear") != null ? String.valueOf(args.get("startYear")) : "2022";
                String endYear = args.get("endYear") != null ? String.valueOf(args.get("endYear")) : "Present";
                String description = extractTextArg(args);

                ArrayNode expArray;
                if (resumeJson.has("experience") && resumeJson.get("experience").isArray()) {
                    expArray = (ArrayNode) resumeJson.get("experience");
                } else {
                    expArray = resumeJson.putArray("experience");
                }

                ObjectNode exp = expArray.addObject();
                exp.put("id", System.currentTimeMillis());
                exp.put("company", company);
                exp.put("title", roleTitle);
                exp.put("startMonth", "Jan");
                exp.put("startYear", startYear);
                exp.put("endMonth", "Present".equalsIgnoreCase(endYear) ? "Present" : "Dec");
                exp.put("endYear", "Present".equalsIgnoreCase(endYear) ? "" : endYear);
                exp.put("location", "Remote / Hybrid");

                ArrayNode bullets = exp.putArray("bullets");
                if (description != null && !description.trim().isEmpty()) {
                    for (String b : description.split("\n|\\.|;")) {
                        if (!b.trim().isEmpty()) bullets.add(b.trim());
                    }
                } else {
                    bullets.add("Led cross-functional software engineering team delivering cloud-native products.");
                    bullets.add("Reduced operational latency by 35% using caching and asynchronous processing.");
                }

                modifiedSections.add("Work Experience");
            } else if ("change_template".equals(call.getToolName())) {
                Object tplObj = call.getArguments().get("templateId");
                if (tplObj instanceof Number) {
                    selectedTemplateId = ((Number) tplObj).longValue();
                }
                if (resume != null) {
                    resume.setTemplateId(selectedTemplateId);
                }
                modifiedSections.add("Template Settings");
            }
        }

        // Generate User-Friendly Explanation
        String userFriendlyExplanation;
        if (executedToolName.equals("update_resume_summary")) {
            userFriendlyExplanation = "I've updated your Executive Summary section! Take a look at your live preview on the right.";
        } else if (executedToolName.equals("update_resume_skills")) {
            userFriendlyExplanation = "I've updated your Skills & Technologies section with your core competencies! Check out your live preview.";
        } else if (executedToolName.equals("add_project")) {
            userFriendlyExplanation = "I've added your Technical Project with your description, GitHub link, and live demo URL! View your live preview.";
        } else if (executedToolName.equals("add_experience")) {
            userFriendlyExplanation = "I've added your Work Experience and key accomplishments to your resume!";
        } else if (executedToolName.equals("change_template")) {
            userFriendlyExplanation = "I've updated your resume visual layout template! Take a look at your live preview.";
        } else {
            userFriendlyExplanation = "I've updated your resume based on your request! Check your live preview.";
        }

        // 6. Persist canonical state in backend database
        try {
            String updatedJsonString = objectMapper.writeValueAsString(resumeJson);
            if (resume == null) {
                resume = Resume.builder()
                        .userId(userId != null ? userId : 1L)
                        .templateId(selectedTemplateId)
                        .title(profession + " Resume")
                        .contentJson(updatedJsonString)
                        .build();
            } else {
                resume.setContentJson(updatedJsonString);
            }
            resumeRepository.save(resume);
        } catch (Exception e) {
            // Log fallback
        }

        return new AgentExecutionResponse(
                true,
                userFriendlyExplanation,
                executedToolName,
                resumeJson,
                selectedTemplateId,
                modifiedSections
        );
    }

    public GeminiLlmAgentClient.AgentLlmDecision executeGeminiLlmCall(String systemPrompt, String userMessage) {
        return geminiLlmAgentClient.sendPromptWithTools(systemPrompt, userMessage, List.of());
    }

    private String extractTextArg(Map<String, Object> args) {
        if (args == null) return null;
        if (args.containsKey("text")) return String.valueOf(args.get("text"));
        if (args.containsKey("newSummaryText")) return String.valueOf(args.get("newSummaryText"));
        if (args.containsKey("skillsText")) return String.valueOf(args.get("skillsText"));
        return null;
    }

    private ObjectNode createDefaultResumeJson(String profession) {
        ObjectNode node = objectMapper.createObjectNode();
        ObjectNode personalInfo = node.putObject("personalInfo");
        personalInfo.put("fullName", "Alex Johnson");
        personalInfo.put("jobTitle", profession + " Specialist");
        personalInfo.put("location", "New York, NY");
        personalInfo.put("email", "alex.johnson@example.com");
        personalInfo.put("phone", "+1 (555) 019-2834");

        node.put("summary", "Results-driven professional with strong domain background.");

        ArrayNode skills = node.putArray("skillCategories");
        ObjectNode sk1 = skills.addObject();
        sk1.put("id", 1);
        sk1.put("categoryName", "Core Competencies");
        sk1.put("items", "Project Management, Communication, Strategic Planning");

        return node;
    }
}
