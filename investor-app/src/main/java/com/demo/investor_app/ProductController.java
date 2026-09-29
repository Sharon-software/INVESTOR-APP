package com.demo.investor_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return StreamSupport.stream(productRepository.findAll().spliterator(), false).toList();
    }
}