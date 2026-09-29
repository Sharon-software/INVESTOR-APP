package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/withdrawal")
@CrossOrigin(origins = "http://localhost:5173")
public class WithdrawalController {

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> withdraw(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam BigDecimal amount) {

        var userOpt = authHelper.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return error(HttpStatus.UNAUTHORIZED, "Unauthorized. Please log in.");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return error(HttpStatus.BAD_REQUEST, "Withdrawal amount must be greater than zero.");
        }

        Register user = userOpt.get();
        BigDecimal currentBalance = BigDecimal.valueOf(user.getBalance());
        if (amount.compareTo(currentBalance) > 0) {
            return error(HttpStatus.BAD_REQUEST,
                    "Withdrawal amount exceeds your available balance of R" + currentBalance + ".");
        }

        BigDecimal newBalance = currentBalance.subtract(amount);
        user.setBalance(newBalance.doubleValue());
        registerRepository.save(user);

        Transaction transaction = new Transaction(user.getId(), "withdrawal", amount.negate(), LocalDateTime.now());
        transactionRepository.save(transaction);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Withdrawal successful");
        response.put("newBalance", newBalance);
        return ResponseEntity.ok(response);
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        Map<String, String> body = new HashMap<>();
        body.put("error", message);
        return ResponseEntity.status(status).body(body);
    }
}
