package com.resumebuilder.controller;

import com.resumebuilder.model.Entities;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.UserRepository;
import com.resumebuilder.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public static class AuthRequest {
        private String email;
        private String password;
        private String fullName;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email is already registered"));
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName() != null ? request.getFullName() : "User");
        user.setRole(Entities.Role.ROLE_USER);
        user.setSubscriptionTier(Entities.SubscriptionTier.FREE);
        userRepository.save(user);

        String token = jwtUtils.generateAccessToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of("id", user.getId(), "email", user.getEmail(), "fullName", user.getFullName(), "role", user.getRole().name(), "tier", user.getSubscriptionTier().name())
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
        }

        String token = jwtUtils.generateAccessToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of("id", user.getId(), "email", user.getEmail(), "fullName", user.getFullName(), "role", user.getRole().name(), "tier", user.getSubscriptionTier().name())
        ));
    }
}
