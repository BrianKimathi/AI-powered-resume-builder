package com.resumebuilder.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, unique = true)
    private String paystackReference;

    @Column(nullable = false)
    private BigDecimal amount;

    private String currency = "NGN";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Entities.PaymentStatus status;

    private String paymentType;
    private Long targetTemplateId;

    @Column(columnDefinition = "TEXT")
    private String rawWebhookPayload;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Payment() {}

    public Payment(Long userId, String paystackReference, BigDecimal amount, String currency, Entities.PaymentStatus status, String paymentType, Long targetTemplateId, String rawWebhookPayload) {
        this.userId = userId;
        this.paystackReference = paystackReference;
        this.amount = amount;
        this.currency = currency != null ? currency : "NGN";
        this.status = status;
        this.paymentType = paymentType;
        this.targetTemplateId = targetTemplateId;
        this.rawWebhookPayload = rawWebhookPayload;
    }

    public static PaymentBuilder builder() {
        return new PaymentBuilder();
    }

    public static class PaymentBuilder {
        private Long userId;
        private String paystackReference;
        private BigDecimal amount;
        private String currency = "NGN";
        private Entities.PaymentStatus status;
        private String paymentType;
        private Long targetTemplateId;
        private String rawWebhookPayload;

        public PaymentBuilder userId(Long userId) { this.userId = userId; return this; }
        public PaymentBuilder paystackReference(String paystackReference) { this.paystackReference = paystackReference; return this; }
        public PaymentBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public PaymentBuilder currency(String currency) { this.currency = currency; return this; }
        public PaymentBuilder status(Entities.PaymentStatus status) { this.status = status; return this; }
        public PaymentBuilder paymentType(String paymentType) { this.paymentType = paymentType; return this; }
        public PaymentBuilder targetTemplateId(Long targetTemplateId) { this.targetTemplateId = targetTemplateId; return this; }
        public PaymentBuilder rawWebhookPayload(String rawWebhookPayload) { this.rawWebhookPayload = rawWebhookPayload; return this; }

        public Payment build() {
            return new Payment(userId, paystackReference, amount, currency, status, paymentType, targetTemplateId, rawWebhookPayload);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPaystackReference() { return paystackReference; }
    public void setPaystackReference(String paystackReference) { this.paystackReference = paystackReference; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Entities.PaymentStatus getStatus() { return status; }
    public void setStatus(Entities.PaymentStatus status) { this.status = status; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Long getTargetTemplateId() { return targetTemplateId; }
    public void setTargetTemplateId(Long targetTemplateId) { this.targetTemplateId = targetTemplateId; }

    public String getRawWebhookPayload() { return rawWebhookPayload; }
    public void setRawWebhookPayload(String rawWebhookPayload) { this.rawWebhookPayload = rawWebhookPayload; }

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
