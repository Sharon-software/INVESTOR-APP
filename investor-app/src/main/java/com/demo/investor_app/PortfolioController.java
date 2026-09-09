package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "http://localhost:5173")
public class PortfolioController {

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<?> getPortfolio(@RequestHeader("Authorization") String authHeader) {

        var userOpt = authHelper.getUserFromToken(authHeader);

        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Unauthorized. Please log in.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Register user = userOpt.get();
        List<Investment> investments = investmentRepository.findByUserId(user.getId());

        List<Map<String, Object>> portfolio = new ArrayList<>();
        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;

        for (Investment inv : investments) {
            var productOpt = productRepository.findById(inv.getProductId());
            if (productOpt.isEmpty()) continue;

            Product product = productOpt.get();

            // Calculate days elapsed (fractional, using hours for smoother demo growth)
            double hoursElapsed = Duration.between(inv.getDateInvested(), LocalDateTime.now()).toMinutes() / 60.0;
            double daysElapsed = hoursElapsed / 24.0;

            // current_value = amount * (1 + dailyRate) ^ daysElapsed
            double rate = product.getDailyReturnRate().doubleValue();
            double amount = inv.getAmountInvested().doubleValue();
            double currentValueRaw = amount * Math.pow(1 + rate, daysElapsed);

            BigDecimal currentValue = BigDecimal.valueOf(currentValueRaw).setScale(2, RoundingMode.HALF_UP);
            BigDecimal profit = currentValue.subtract(inv.getAmountInvested());

            Map<String, Object> item = new HashMap<>();
            item.put("investmentId", inv.getId());
            item.put("productName", product.getName());
            item.put("amountInvested", inv.getAmountInvested());
            item.put("currentValue", currentValue);
            item.put("profit", profit);
            item.put("dateInvested", inv.getDateInvested());
            item.put("dailyReturnRate", product.getDailyReturnRate());

            portfolio.add(item);

            totalInvested = totalInvested.add(inv.getAmountInvested());
            totalCurrentValue = totalCurrentValue.add(currentValue);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("balance", user.getBalance());
        response.put("totalInvested", totalInvested);
        response.put("totalCurrentValue", totalCurrentValue);
        response.put("totalProfit", totalCurrentValue.subtract(totalInvested));
        response.put("investments", portfolio);

        return ResponseEntity.ok(response);
    }
}