package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthHelper {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RegisterRepository registerRepository;

    public Optional<Register> getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Optional.empty();
        }

        String token = authHeader.substring(7); // remove "Bearer "

        if (!jwtUtil.isTokenValid(token)) {
            return Optional.empty();
        }

        String email = jwtUtil.extractEmail(token);
        return registerRepository.findByEmail(email);
    }
}