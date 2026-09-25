package com.resumebuilder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Entities.Role role = Entities.Role.ROLE_USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Entities.SubscriptionTier subscriptionTier = Entities.SubscriptionTier.FREE;

    private Integer aiCreditsRemaining = 5;

    private Boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public User() {}

    public User(Long id, String email, String password, String fullName, Entities.Role role, Entities.SubscriptionTier subscriptionTier, Integer aiCreditsRemaining, Boolean active) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role != null ? role : Entities.Role.ROLE_USER;
        this.subscriptionTier = subscriptionTier != null ? subscriptionTier : Entities.SubscriptionTier.FREE;
        this.aiCreditsRemaining = aiCreditsRemaining != null ? aiCreditsRemaining : 5;
        this.active = active != null ? active : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Entities.Role getRole() { return role; }
    public void setRole(Entities.Role role) { this.role = role; }

    public Entities.SubscriptionTier getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(Entities.SubscriptionTier subscriptionTier) { this.subscriptionTier = subscriptionTier; }

    public Integer getAiCreditsRemaining() { return aiCreditsRemaining; }
    public void setAiCreditsRemaining(Integer aiCreditsRemaining) { this.aiCreditsRemaining = aiCreditsRemaining; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

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
