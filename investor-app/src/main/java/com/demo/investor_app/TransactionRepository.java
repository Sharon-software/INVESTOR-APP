package com.demo.investor_app;

import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface TransactionRepository extends CrudRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);
}