package com.resumebuilder.dto;

import java.util.List;

public class AgentExecutionResponse {
    private boolean success;
    private String agentExplanation;
    private String toolExecuted;
    private Object updatedResumeData;
    private Long selectedTemplateId;
    private List<String> modifiedSections;

    public AgentExecutionResponse() {}

    public AgentExecutionResponse(boolean success, String agentExplanation, String toolExecuted, Object updatedResumeData, Long selectedTemplateId, List<String> modifiedSections) {
        this.success = success;
        this.agentExplanation = agentExplanation;
        this.toolExecuted = toolExecuted;
        this.updatedResumeData = updatedResumeData;
        this.selectedTemplateId = selectedTemplateId;
        this.modifiedSections = modifiedSections;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getAgentExplanation() { return agentExplanation; }
    public void setAgentExplanation(String agentExplanation) { this.agentExplanation = agentExplanation; }

    public String getToolExecuted() { return toolExecuted; }
    public void setToolExecuted(String toolExecuted) { this.toolExecuted = toolExecuted; }

    public Object getUpdatedResumeData() { return updatedResumeData; }
    public void setUpdatedResumeData(Object updatedResumeData) { this.updatedResumeData = updatedResumeData; }

    public Long getSelectedTemplateId() { return selectedTemplateId; }
    public void setSelectedTemplateId(Long selectedTemplateId) { this.selectedTemplateId = selectedTemplateId; }

    public List<String> getModifiedSections() { return modifiedSections; }
    public void setModifiedSections(List<String> modifiedSections) { this.modifiedSections = modifiedSections; }
}
