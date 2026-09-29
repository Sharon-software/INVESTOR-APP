package com.demo.investor_app;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("TRANSACTION_RECORD")
public class Transaction {

    @Id
    private Long id;
    private Long userId;
    private String type; // "deposit", "withdrawal", "income", "investment"
    private BigDecimal amount;
    private LocalDateTime date;

    public Transaction() {}

    public Transaction(Long userId, String type, BigDecimal amount, LocalDateTime date) {
        this.userId = userId;
        this.type = type;
        this.amount = amount;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}