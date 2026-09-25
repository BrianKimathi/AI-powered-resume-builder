package com.resumebuilder.service;

import com.resumebuilder.ai.GeminiLlmAgentClient;
import com.resumebuilder.dto.AgentExecutionRequest;
import com.resumebuilder.dto.AgentExecutionResponse;
import com.resumebuilder.repository.ResumeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ResumeAgentEngineServiceTest {

    @Autowired
    private ResumeAgentEngineService resumeAgentEngineService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Test
    @DisplayName("AI Agent should parse multi-category skill sets cleanly")
    public void testSkillExtraction() {
        String skillInput = "My skills include:\n* **Programming:** Java, Kotlin, Python\n* **Backend:** Spring Boot, REST APIs\n* **DevOps:** Docker, Kubernetes";

        AgentExecutionRequest request = new AgentExecutionRequest();
        request.setUserInstruction(skillInput);
        request.setProfession("Software Engineering");

        AgentExecutionResponse response = resumeAgentEngineService.executeAgentLoop(request, 1L);

        assertNotNull(response);
        assertTrue(response.isSuccess());
    }

    @Test
    @DisplayName("AI Agent should return response for general summary request")
    public void testSummaryUpdate() {
        AgentExecutionRequest request = new AgentExecutionRequest();
        request.setUserInstruction("Update my professional summary for a Senior Cloud Architect role");
        request.setProfession("Cloud Engineering");

        AgentExecutionResponse response = resumeAgentEngineService.executeAgentLoop(request, 1L);

        assertNotNull(response);
        assertNotNull(response.getAgentExplanation());
    }
}
