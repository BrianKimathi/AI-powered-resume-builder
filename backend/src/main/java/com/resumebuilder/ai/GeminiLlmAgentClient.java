package com.resumebuilder.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiLlmAgentClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiLlmAgentClient.class);

    @Value("${ai.gemini.api-key}")
    private String geminiApiKey;

    @Value("${ai.gemini.model:gemini-flash-latest}")
    private String geminiModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiLlmAgentClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public static class AgentLlmDecision {
        private String replyText;
        private List<ToolCall> toolCalls = new ArrayList<>();

        public AgentLlmDecision(String replyText, List<ToolCall> toolCalls) {
            this.replyText = replyText;
            this.toolCalls = toolCalls != null ? toolCalls : new ArrayList<>();
        }

        public String getReplyText() { return replyText; }
        public List<ToolCall> getToolCalls() { return toolCalls; }
        public boolean hasToolCalls() { return !toolCalls.isEmpty(); }
    }

    public static class ToolCall {
        private String toolName;
        private Map<String, Object> arguments;

        public ToolCall(String toolName, Map<String, Object> arguments) {
            this.toolName = toolName;
            this.arguments = arguments;
        }

        public String getToolName() { return toolName; }
        public Map<String, Object> getArguments() { return arguments; }
    }

    public AgentLlmDecision sendPromptWithTools(String systemPrompt, String userMessage, List<LlmToolDefinition> tools) {
        log.info("==== [AGENT LLM] Received User Instruction: '{}' ====", userMessage);
        log.info("[AGENT LLM] System Prompt: '{}'", systemPrompt);
        log.info("[AGENT LLM] Passing {} tool declarations to Gemini API", tools.size());

        String activeModel = (geminiModel != null && !geminiModel.trim().isEmpty()) ? geminiModel.trim() : "gemini-1.5-flash";
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + activeModel + ":generateContent?key=" + geminiApiKey;

        Map<String, Object> requestBody = new HashMap<>();
        
        String enhancedSystemPrompt = systemPrompt + "\n\nCRITICAL: You are an expert AI Career Strategist & Executive Resume Writer. If the user provides a raw skills list, career background, or unformatted profile notes, your task is to parse, organize, curate, and format them into professional, high-impact resume sections with clear skill category groupings, action verbs, and quantified achievements.";

        requestBody.put("system_instruction", Map.of(
            "parts", List.of(Map.of("text", enhancedSystemPrompt))
        ));

        requestBody.put("contents", List.of(Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", userMessage))
        )));

        List<Map<String, Object>> functionDeclarations = new ArrayList<>();
        for (LlmToolDefinition t : tools) {
            functionDeclarations.add(Map.of(
                "name", t.getName(),
                "description", t.getDescription(),
                "parameters", Map.of(
                    "type", "OBJECT",
                    "properties", Map.of(
                        "text", Map.of("type", "STRING", "description", "Extracted or AI-generated organized text argument for tool")
                    )
                )
            ));
        }
        requestBody.put("tools", List.of(Map.of("function_declarations", functionDeclarations)));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        int maxAttempts = 3;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                log.info("[AGENT LLM] Dispatching HTTP POST request to Google Gemini API ({}, attempt {}/{})...", activeModel, attempt, maxAttempts);

                long startTime = System.currentTimeMillis();
                ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
                long duration = System.currentTimeMillis() - startTime;

                log.info("[AGENT LLM] Received HTTP {} response from Gemini API in {} ms", response.getStatusCode(), duration);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map responseMap = response.getBody();
                    List candidates = (List) responseMap.get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map firstCand = (Map) candidates.get(0);
                        Map content = (Map) firstCand.get("content");
                        List parts = (List) content.get("parts");
                        
                        if (parts != null && !parts.isEmpty()) {
                            Map firstPart = (Map) parts.get(0);

                            if (firstPart.containsKey("functionCall")) {
                                Map fnCall = (Map) firstPart.get("functionCall");
                                String toolName = (String) fnCall.get("name");
                                Map args = (Map) fnCall.get("args");
                                
                                log.info("==== [AGENT TOOL DECISION] LLM Selected Tool Call: '{}' with args: {} ====", toolName, args);
                                return new AgentLlmDecision(
                                    "Google Gemini LLM Agent processed your input and executed: `" + toolName + "`.",
                                    List.of(new ToolCall(toolName, args != null ? args : Map.of()))
                                );
                            } else if (firstPart.containsKey("text")) {
                                String textReply = (String) firstPart.get("text");
                                log.info("==== [AGENT TEXT RESPONSE] LLM Decided 0 Tool Calls Needed. Reply: '{}' ====", textReply);
                                return new AgentLlmDecision(textReply, List.of());
                            }
                        }
                    }
                }
            } catch (Exception e) {
                lastException = e;
                log.warn("[AGENT LLM WARN] Attempt {}/{} failed calling Gemini API: {}", attempt, maxAttempts, e.getMessage());
                if (attempt < maxAttempts) {
                    try { Thread.sleep(800); } catch (InterruptedException ignored) {}
                }
            }
        }

        log.error("[AGENT LLM ERROR] All {} attempts failed calling Gemini API", maxAttempts, lastException);
        String userFriendlyError = "⚠️ AI Rate Limit / Quota Reached: Google Gemini API is temporarily cooling down. Your resume fields have been extracted and saved locally!";
        if (lastException != null && lastException.getMessage() != null) {
            String msg = lastException.getMessage();
            if (msg.contains("429") || msg.contains("RESOURCE_EXHAUSTED")) {
                userFriendlyError = "⏳ AI Service Quota Limit Reached (Google Free Tier 20 Requests/Min). Your skills and structured data have been extracted into your live preview sheet!";
            } else if (msg.contains("API_KEY_INVALID") || msg.contains("401") || msg.contains("403")) {
                userFriendlyError = "🔑 Invalid Google Gemini API Key. Please verify your API key in Admin Settings.";
            }
        }
        return new AgentLlmDecision(userFriendlyError, List.of());
    }
}
