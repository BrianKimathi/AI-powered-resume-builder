package com.resumebuilder.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // FREE, PLUS, PRO

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal priceMonthly;

    @Column(nullable = false)
    private String currency = "NGN";

    private Integer aiCreditsLimit = 5;
    private Integer resumeLimit = 1;

    private Boolean active = true;
    private Boolean featured = false;
    private Integer displayOrder = 0;

    @Column(columnDefinition = "TEXT")
    private String entitlementsJson; // e.g. ["CAN_USE_PREMIUM_TEMPLATES", "CAN_USE_ADVANCED_ATS", "CAN_USE_JOB_MATCHING"]

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Plan() {}

    public Plan(String code, String name, String description, BigDecimal priceMonthly, String currency, Integer aiCreditsLimit, Integer resumeLimit, Boolean active, Boolean featured, Integer displayOrder, String entitlementsJson) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.priceMonthly = priceMonthly;
        this.currency = currency != null ? currency : "NGN";
        this.aiCreditsLimit = aiCreditsLimit != null ? aiCreditsLimit : 5;
        this.resumeLimit = resumeLimit != null ? resumeLimit : 1;
        this.active = active != null ? active : true;
        this.featured = featured != null ? featured : false;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.entitlementsJson = entitlementsJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPriceMonthly() { return priceMonthly; }
    public void setPriceMonthly(BigDecimal priceMonthly) { this.priceMonthly = priceMonthly; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getAiCreditsLimit() { return aiCreditsLimit; }
    public void setAiCreditsLimit(Integer aiCreditsLimit) { this.aiCreditsLimit = aiCreditsLimit; }

    public Integer getResumeLimit() { return resumeLimit; }
    public void setResumeLimit(Integer resumeLimit) { this.resumeLimit = resumeLimit; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getEntitlementsJson() { return entitlementsJson; }
    public void setEntitlementsJson(String entitlementsJson) { this.entitlementsJson = entitlementsJson; }

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
