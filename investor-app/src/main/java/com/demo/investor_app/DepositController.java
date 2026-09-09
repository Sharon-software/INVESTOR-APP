package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/deposit")
@CrossOrigin(origins = "http://localhost:5173")
public class DepositController {

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping
    public ResponseEntity<?> deposit(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam BigDecimal amount) {

        var userOpt = authHelper.getUserFromToken(authHeader);

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized. Please log in.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Deposit amount must be greater than zero.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        Register user = userOpt.get();
        user.setBalance(user.getBalance() + amount.doubleValue());
        registerRepository.save(user);

        Transaction transaction = new Transaction(user.getId(), "deposit", amount, LocalDateTime.now());
        transactionRepository.save(transaction);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Deposit successful");
        response.put("newBalance", user.getBalance());
        return ResponseEntity.ok(response);
    }
}