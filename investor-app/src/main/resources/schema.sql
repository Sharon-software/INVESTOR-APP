DROP TABLE IF EXISTS register;
DROP TABLE IF EXISTS investment;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS product;

CREATE TABLE register (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          full_name VARCHAR(255) NOT NULL,
                          email VARCHAR(255) NOT NULL UNIQUE,
                          is_verified BOOLEAN DEFAULT FALSE,
                          verification_token VARCHAR(255),
                          verification_code_expiry TIMESTAMP,
                          phone_number VARCHAR(20),
                          password VARCHAR(255) NOT NULL,
                          date_of_birth DATE,
                          balance DECIMAL(15,2) DEFAULT 0.00
);

CREATE TABLE product (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         price DECIMAL(15,2) NOT NULL,
                         description VARCHAR(500),
                         daily_return_rate DECIMAL(5,4) DEFAULT 0.0100
);

CREATE TABLE investment (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            user_id BIGINT NOT NULL,
                            product_id BIGINT NOT NULL,
                            amount_invested DECIMAL(15,2) NOT NULL,
                            date_invested TIMESTAMP NOT NULL,
                            FOREIGN KEY (user_id) REFERENCES register(id),
                            FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE transaction (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             user_id BIGINT NOT NULL,
                             type VARCHAR(50) NOT NULL,
                             amount DECIMAL(15,2) NOT NULL,
                             date TIMESTAMP NOT NULL,
                             FOREIGN KEY (user_id) REFERENCES register(id)
);