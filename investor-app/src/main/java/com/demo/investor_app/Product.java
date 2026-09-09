package com.demo.investor_app;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;

@Table("PRODUCT")
public class Product {

    @Id
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private BigDecimal dailyReturnRate;

    public Product() {}

    public Product(String name, BigDecimal price, String description, BigDecimal dailyReturnRate) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.dailyReturnRate = dailyReturnRate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getDailyReturnRate() { return dailyReturnRate; }
    public void setDailyReturnRate(BigDecimal dailyReturnRate) { this.dailyReturnRate = dailyReturnRate; }
}