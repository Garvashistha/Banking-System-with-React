package org.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
    "org.bank",
    "config",
    "api",
    "service",
    "repository",
    "entities", 
    "util",
    "dto"
})
@EnableJpaRepositories(basePackages = "repository")
@EntityScan(basePackages = "entities")
public class BankingSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(BankingSystemApplication.class, args);
    }
}
