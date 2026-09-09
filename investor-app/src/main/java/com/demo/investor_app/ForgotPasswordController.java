package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/forgot-password")
@CrossOrigin(origins = "http://localhost:5173")
public class ForgotPasswordController {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Step 1: request a reset code
    @PostMapping("/request")
    public ResponseEntity<?> requestReset(@RequestParam String email) {

        var userOpt = registerRepository.findByEmail(email);

        // Always return success even if email not found (avoid leaking which emails are registered)
        if (userOpt.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "If that email is registered, a reset code has been generated.");
            return ResponseEntity.ok(response);
        }

        Register user = userOpt.get();
        String code = String.format("%06d", new Random().nextInt(999999));

        user.setVerificationToken(code);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));
        registerRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "If that email is registered, a reset code has been generated.");
        response.put("resetCode", code); // TEMPORARY - remove once real email sending is added
        return ResponseEntity.ok(response);
    }

    // Step 2: submit code + new password
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String code,
            @RequestParam String newPassword) {

        var userOpt = registerRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid request");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Register user = userOpt.get();

        if (user.getVerificationCodeExpiry() == null || LocalDateTime.now().isAfter(user.getVerificationCodeExpiry())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Reset code has expired. Please request a new one.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (user.getVerificationToken() == null || !user.getVerificationToken().equals(code)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid reset code");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Basic strength check (same rule as registration)
        if (!newPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationToken(null);
        user.setVerificationCodeExpiry(null);
        registerRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successful. You can now log in with your new password.");
        return ResponseEntity.ok(response);
    }
}