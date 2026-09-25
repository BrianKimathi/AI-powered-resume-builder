package com.resumebuilder.service;

import com.resumebuilder.model.Entities;
import com.resumebuilder.model.Payment;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.PaymentRepository;
import com.resumebuilder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public class PaystackService {

    @Value("${paystack.secret-key}")
    private String paystackSecretKey;

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public PaystackService(PaymentRepository paymentRepository, UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    public boolean verifyWebhookSignature(String rawBody, String headerSignature) {
        try {
            Mac sha512Hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(paystackSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            sha512Hmac.init(secretKey);
            byte[] hash = sha512Hmac.doFinal(rawBody.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }
            return result.toString().equalsIgnoreCase(headerSignature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            return false;
        }
    }

    @Transactional
    public void processSuccessfulPayment(String reference, Long userId, BigDecimal amount, String paymentType, String rawPayload) {
        if (paymentRepository.findByPaystackReference(reference).isPresent()) {
            return;
        }

        Payment payment = Payment.builder()
                .userId(userId)
                .paystackReference(reference)
                .amount(amount)
                .status(Entities.PaymentStatus.SUCCESS)
                .paymentType(paymentType)
                .rawWebhookPayload(rawPayload)
                .build();
        paymentRepository.save(payment);

        User user = userRepository.findById(userId).orElseThrow();
        if ("PRO_SUBSCRIPTION".equalsIgnoreCase(paymentType)) {
            user.setSubscriptionTier(Entities.SubscriptionTier.PRO_MONTHLY);
            user.setAiCreditsRemaining(100);
        } else if ("AI_CREDIT_TOPUP".equalsIgnoreCase(paymentType)) {
            user.setAiCreditsRemaining(user.getAiCreditsRemaining() + 20);
        }
        userRepository.save(user);
    }
}
