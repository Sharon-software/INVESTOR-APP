package com.demo.investor_app;

import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface RegisterRepository extends CrudRepository<Register, Long> {
    Optional<Register> findByEmail(String email);
}