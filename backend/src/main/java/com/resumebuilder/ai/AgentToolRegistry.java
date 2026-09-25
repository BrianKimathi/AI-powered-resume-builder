package com.resumebuilder.ai;

import java.util.List;

public class AgentToolRegistry {

    public interface ResumeTool {
        String name();
        String description();
        boolean isMutation();
        ToolResult execute(ToolContext context, String inputJson);
    }

    public static class ToolContext {
        private final Long userId;
        private final Long resumeId;
        private final String profession;

        public ToolContext(Long userId, Long resumeId, String profession) {
            this.userId = userId;
            this.resumeId = resumeId;
            this.profession = profession;
        }

        public Long getUserId() { return userId; }
        public Long getResumeId() { return resumeId; }
        public String getProfession() { return profession; }
    }

    public static class ToolResult {
        private final boolean success;
        private final String toolExecuted;
        private final String outputData;

        public ToolResult(boolean success, String toolExecuted, String outputData) {
            this.success = success;
            this.toolExecuted = toolExecuted;
            this.outputData = outputData;
        }

        public boolean isSuccess() { return success; }
        public String getToolExecuted() { return toolExecuted; }
        public String getOutputData() { return outputData; }
    }
}
