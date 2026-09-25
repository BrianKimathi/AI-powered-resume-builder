package com.resumebuilder.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.resumebuilder.model.Resume;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResumeTools {

    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;

    public ResumeTools(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
        this.objectMapper = new ObjectMapper();
    }

    public AgentToolRegistry.ResumeTool getResumeSummaryTool() {
        return new AgentToolRegistry.ResumeTool() {
            @Override
            public String name() { return "get_resume_summary"; }

            @Override
            public String description() {
                return "Returns the candidate's current professional summary. Use this tool only when inspecting summary content before editing.";
            }

            @Override
            public boolean isMutation() { return false; }

            @Override
            public AgentToolRegistry.ToolResult execute(AgentToolRegistry.ToolContext context, String inputJson) {
                Resume resume = resumeRepository.findById(context.getResumeId()).orElse(null);
                if (resume == null || resume.getContentJson() == null) {
                    return new AgentToolRegistry.ToolResult(false, name(), "No existing summary found.");
                }
                try {
                    ObjectNode node = (ObjectNode) objectMapper.readTree(resume.getContentJson());
                    String summary = node.has("summary") ? node.get("summary").asText() : "";
                    return new AgentToolRegistry.ToolResult(true, name(), summary);
                } catch (Exception e) {
                    return new AgentToolRegistry.ToolResult(false, name(), "Error reading summary");
                }
            }
        };
    }

    public AgentToolRegistry.ResumeTool updateResumeSummaryTool() {
        return new AgentToolRegistry.ResumeTool() {
            @Override
            public String name() { return "update_resume_summary"; }

            @Override
            public String description() {
                return "Updates the professional summary of the user's resume. Do NOT call this for greetings or questions.";
            }

            @Override
            public boolean isMutation() { return true; }

            @Override
            public AgentToolRegistry.ToolResult execute(AgentToolRegistry.ToolContext context, String inputJson) {
                Resume resume = resumeRepository.findById(context.getResumeId()).orElse(null);
                try {
                    ObjectNode node;
                    if (resume != null && resume.getContentJson() != null) {
                        node = (ObjectNode) objectMapper.readTree(resume.getContentJson());
                    } else {
                        node = objectMapper.createObjectNode();
                    }
                    node.put("summary", inputJson);

                    String updatedJson = objectMapper.writeValueAsString(node);
                    if (resume == null) {
                        resume = Resume.builder()
                                .userId(context.getUserId())
                                .title(context.getProfession() + " Resume")
                                .templateId(2L)
                                .contentJson(updatedJson)
                                .build();
                    } else {
                        resume.setContentJson(updatedJson);
                    }
                    resumeRepository.save(resume);
                    return new AgentToolRegistry.ToolResult(true, name(), inputJson);
                } catch (Exception e) {
                    return new AgentToolRegistry.ToolResult(false, name(), "Failed to update summary.");
                }
            }
        };
    }
}
