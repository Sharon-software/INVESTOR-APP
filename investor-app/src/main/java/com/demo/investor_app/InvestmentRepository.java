package com.demo.investor_app;

import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface InvestmentRepository extends CrudRepository<Investment, Long> {
    List<Investment> findByUserId(Long userId);
}