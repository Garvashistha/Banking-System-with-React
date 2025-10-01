package com.org.bank.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
public class AccountApiController {

    @GetMapping("/savings")
    public ResponseEntity<?> getSavings() {
        return ResponseEntity.ok(Map.of("balance", 15000));
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrent() {
        return ResponseEntity.ok(Map.of("balance", 10000));
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getTotalBalance() {
        return ResponseEntity.ok(Map.of("totalBalance", 25000));
    }
}
