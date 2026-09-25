package com.resumebuilder.dto;

import java.util.List;
import java.util.Map;

public class AgentExecutionRequest {
    private Long resumeId;
    private String userInstruction;
    private String profession;
    private String selectedSection;

    public AgentExecutionRequest() {}

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getUserInstruction() { return userInstruction; }
    public void setUserInstruction(String userInstruction) { this.userInstruction = userInstruction; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getSelectedSection() { return selectedSection; }
    public void setSelectedSection(String selectedSection) { this.selectedSection = selectedSection; }
}
