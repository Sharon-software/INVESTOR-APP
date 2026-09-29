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
@RequestMapping("/api/invest")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class InvestmentController {

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping
    public ResponseEntity<?> invest(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId,
            @RequestParam BigDecimal amount) {

        var userOpt = authHelper.getUserFromToken(authHeader);

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized. Please log in.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Investment amount must be greater than zero.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Product not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Register user = userOpt.get();
        BigDecimal currentBalance = BigDecimal.valueOf(user.getBalance());

        if (currentBalance.compareTo(amount) < 0) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Insufficient balance. Your current balance is " + currentBalance);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Deduct balance
        user.setBalance(currentBalance.subtract(amount).doubleValue());
        registerRepository.save(user);

        // Record the investment
        Investment investment = new Investment(user.getId(), productId, amount, LocalDateTime.now());
        investmentRepository.save(investment);

        // Record the transaction
        Transaction transaction = new Transaction(user.getId(), "investment", amount.negate(), LocalDateTime.now());
        transactionRepository.save(transaction);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Investment successful");
        response.put("productName", productOpt.get().getName());
        response.put("amountInvested", amount);
        response.put("remainingBalance", user.getBalance());
        return ResponseEntity.ok(response);
    }
}