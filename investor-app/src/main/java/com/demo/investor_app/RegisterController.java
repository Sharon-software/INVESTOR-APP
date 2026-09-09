package com.demo.investor_app;

import jakarta.validation.Valid;
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
@RequestMapping("/api/register")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        // Check for duplicate email
        if (registerRepository.findByEmail(request.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        // Generate 6-digit verification code
        String code = String.format("%06d", new Random().nextInt(999999));

        // Build entity
        Register user = new Register(
                request.getFullName(),
                request.getEmail(),
                request.getPhoneNumber(),
                passwordEncoder.encode(request.getPassword()), // hash password
                request.getDateOfBirth()
        );
        user.setVerificationToken(code);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));

        registerRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Registration successful. Email verification not yet enabled — account is usable as-is for now.");
        response.put("verificationCode", code); // TEMPORARY - remove once real email verification is wired up
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}