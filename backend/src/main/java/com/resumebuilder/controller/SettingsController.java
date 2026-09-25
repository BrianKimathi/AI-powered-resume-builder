package com.resumebuilder.controller;

import com.resumebuilder.model.SystemSetting;
import com.resumebuilder.repository.SystemSettingRepository;
import com.resumebuilder.model.User;
import com.resumebuilder.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/settings")
public class SettingsController {

    private final SystemSettingRepository settingRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SettingsController(SystemSettingRepository settingRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.settingRepository = settingRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<Map<String, String>> getSettings() {
        List<SystemSetting> settingsList = settingRepository.findAll();
        Map<String, String> settingsMap = new HashMap<>();
        for (SystemSetting setting : settingsList) {
            settingsMap.put(setting.getSettingKey(), setting.getSettingValue());
        }
        // Defaults if empty
        settingsMap.putIfAbsent("PAYSTACK_PUBLIC_KEY", "pk_test_paystack_public_key_mock");
        settingsMap.putIfAbsent("PAYSTACK_SECRET_KEY", "sk_test_paystack_secret_key_mock");
        settingsMap.putIfAbsent("PAYSTACK_CURRENCY", "KES"); // KES, NGN, USD, GHS
        settingsMap.putIfAbsent("AI_PROVIDER", "gemini");
        settingsMap.putIfAbsent("GEMINI_API_KEY", "your-gemini-api-key-here");
        settingsMap.putIfAbsent("OPENAI_API_KEY", "your-openai-api-key-here");
        return ResponseEntity.ok(settingsMap);
    }

    @PostMapping
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> updatedSettings) {
        for (Map.Entry<String, String> entry : updatedSettings.entrySet()) {
            SystemSetting setting = new SystemSetting(entry.getKey(), entry.getValue());
            settingRepository.save(setting);
        }
        return ResponseEntity.ok(Map.of("message", "System settings successfully updated in vault"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changeAdminPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        if (email == null || newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and non-empty new password required"));
        }
        User admin = userRepository.findByEmail(email).orElse(null);
        if (admin == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Admin account not found"));
        }
        admin.setPassword(passwordEncoder.encode(newPassword.trim()));
        userRepository.save(admin);
        return ResponseEntity.ok(Map.of("message", "Admin password successfully updated"));
    }
}
