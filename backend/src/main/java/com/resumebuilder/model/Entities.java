package com.resumebuilder.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class Entities {

    public enum Role {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_SUPER_ADMIN
    }

    public enum SubscriptionTier {
        FREE,
        PRO_MONTHLY,
        PRO_YEARLY
    }

    public enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED,
        REFUNDED
    }
}
