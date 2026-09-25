package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long templateId = 2L;

    @Column(nullable = false)
    private String title = "Untitled Resume";

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentJson;

    @Version
    private Long version; // JPA Optimistic Locking

    private String activeDeviceId;
    private LocalDateTime activeDeviceLastHeartbeat;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Resume() {}

    public Resume(Long id, Long userId, Long templateId, String title, String contentJson) {
        this.id = id;
        this.userId = userId;
        this.templateId = templateId != null ? templateId : 2L;
        this.title = title != null ? title : "Untitled Resume";
        this.contentJson = contentJson;
    }

    public static ResumeBuilder builder() {
        return new ResumeBuilder();
    }

    public static class ResumeBuilder {
        private Long id;
        private Long userId;
        private Long templateId = 2L;
        private String title = "Untitled Resume";
        private String contentJson;

        public ResumeBuilder id(Long id) { this.id = id; return this; }
        public ResumeBuilder userId(Long userId) { this.userId = userId; return this; }
        public ResumeBuilder templateId(Long templateId) { this.templateId = templateId; return this; }
        public ResumeBuilder title(String title) { this.title = title; return this; }
        public ResumeBuilder contentJson(String contentJson) { this.contentJson = contentJson; return this; }

        public Resume build() {
            return new Resume(id, userId, templateId, title, contentJson);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentJson() { return contentJson; }
    public void setContentJson(String contentJson) { this.contentJson = contentJson; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public String getActiveDeviceId() { return activeDeviceId; }
    public void setActiveDeviceId(String activeDeviceId) { this.activeDeviceId = activeDeviceId; }

    public LocalDateTime getActiveDeviceLastHeartbeat() { return activeDeviceLastHeartbeat; }
    public void setActiveDeviceLastHeartbeat(LocalDateTime activeDeviceLastHeartbeat) { this.activeDeviceLastHeartbeat = activeDeviceLastHeartbeat; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
