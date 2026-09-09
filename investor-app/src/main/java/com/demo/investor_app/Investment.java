package com.demo.investor_app;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("INVESTMENT")
public class Investment {

    @Id
    private Long id;
    private Long userId;
    private Long productId;
    private BigDecimal amountInvested;
    private LocalDateTime dateInvested;

    public Investment() {}

    public Investment(Long userId, Long productId, BigDecimal amountInvested, LocalDateTime dateInvested) {
        this.userId = userId;
        this.productId = productId;
        this.amountInvested = amountInvested;
        this.dateInvested = dateInvested;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public BigDecimal getAmountInvested() { return amountInvested; }
    public void setAmountInvested(BigDecimal amountInvested) { this.amountInvested = amountInvested; }

    public LocalDateTime getDateInvested() { return dateInvested; }
    public void setDateInvested(LocalDateTime dateInvested) { this.dateInvested = dateInvested; }
}