package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private AuthHelper authHelper;

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public ResponseEntity<?> getTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        var userOpt = authHelper.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userOpt.get().getId());
        transactions = filterTransactions(transactions, type, startDate, endDate);

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        var userOpt = authHelper.getUserFromToken(authHeader);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(userOpt.get().getId());
        transactions = filterTransactions(transactions, type, startDate, endDate);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Type,Amount,Date\n");
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (Transaction t : transactions) {
            csv.append(t.getId()).append(",")
                    .append(t.getType()).append(",")
                    .append(t.getAmount()).append(",")
                    .append(t.getDate().format(fmt)).append("\n");
        }

        byte[] csvBytes = csv.toString().getBytes();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/csv");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    private List<Transaction> filterTransactions(List<Transaction> transactions, String type, String startDate, String endDate) {
        return transactions.stream()
                .filter(t -> type == null || type.isBlank() || t.getType().equalsIgnoreCase(type))
                .filter(t -> {
                    if (startDate == null || startDate.isBlank()) return true;
                    LocalDateTime start = LocalDateTime.parse(startDate + "T00:00:00");
                    return !t.getDate().isBefore(start);
                })
                .filter(t -> {
                    if (endDate == null || endDate.isBlank()) return true;
                    LocalDateTime end = LocalDateTime.parse(endDate + "T23:59:59");
                    return !t.getDate().isAfter(end);
                })
                .collect(Collectors.toList());
    }
}