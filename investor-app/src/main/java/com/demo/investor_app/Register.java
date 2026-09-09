package com.demo.investor_app;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("REGISTER")
public class Register {

    @Id
    private Long id;
    private String fullName;
    private String email;
    private boolean isVerified;
    private String verificationToken;
    private LocalDateTime verificationCodeExpiry; // NEW
    private String phoneNumber;
    private String password;
    private LocalDate dateOfBirth;
    private Double balance;

    // Constructors
    public Register() {}

    public Register(String fullName, String email, String phoneNumber, String password, LocalDate dateOfBirth) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.isVerified = false;
        this.balance = 0.0;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public String getVerificationToken() { return verificationToken; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }

    public LocalDateTime getVerificationCodeExpiry() { return verificationCodeExpiry; } // NEW
    public void setVerificationCodeExpiry(LocalDateTime verificationCodeExpiry) { this.verificationCodeExpiry = verificationCodeExpiry; } // NEW

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}