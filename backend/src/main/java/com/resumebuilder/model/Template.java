package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "templates")
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String category;
    private String thumbnailUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Boolean isPremium = false;
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String defaultStructureJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Template() {}

    public Template(String name, String category, Boolean isPremium, Boolean isActive, String description) {
        this.name = name;
        this.category = category;
        this.isPremium = isPremium;
        this.isActive = isActive;
        this.description = description;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getDefaultStructureJson() { return defaultStructureJson; }
    public void setDefaultStructureJson(String defaultStructureJson) { this.defaultStructureJson = defaultStructureJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
