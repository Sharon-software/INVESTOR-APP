package com.demo.investor_app;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DataSourceConfiguration {

    @Bean
    @Primary
    public DataSource dataSource(Environment environment) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            URI uri = URI.create(databaseUrl.replaceFirst("^postgres://", "postgresql://"));
            String[] credentials = uri.getRawUserInfo().split(":", 2);
            String query = uri.getRawQuery();
            String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + uri.getPort()
                    + uri.getRawPath() + (query == null ? "?sslmode=require" : "?" + query);

            return DataSourceBuilder.create()
                    .driverClassName("org.postgresql.Driver")
                    .url(jdbcUrl)
                    .username(URLDecoder.decode(credentials[0], StandardCharsets.UTF_8))
                    .password(URLDecoder.decode(credentials[1], StandardCharsets.UTF_8))
                    .build();
        }

        return DataSourceBuilder.create()
                .driverClassName(environment.getProperty("spring.datasource.driver-class-name", "org.h2.Driver"))
                .url(environment.getProperty("spring.datasource.url", "jdbc:h2:mem:testdb"))
                .username(environment.getProperty("spring.datasource.username", "sa"))
                .password(environment.getProperty("spring.datasource.password", ""))
                .build();
    }
}
