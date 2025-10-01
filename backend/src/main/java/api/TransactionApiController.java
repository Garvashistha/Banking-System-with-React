package com.org.bank.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionApiController {

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody Map<String, Object> body) {
        double amount = (double) body.get("amount");
        return ResponseEntity.ok(Map.of("message", "Deposited " + amount));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> body) {
        double amount = (double) body.get("amount");
        return ResponseEntity.ok(Map.of("message", "Withdrew " + amount));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> body) {
        String toAccount = (String) body.get("toAccount");
        double amount = (double) body.get("amount");
        return ResponseEntity.ok(Map.of("message", "Transferred " + amount + " to " + toAccount));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history() {
        List<Map<String, Object>> history = List.of(
                Map.of("id", 1, "type", "Deposit", "amount", 5000),
                Map.of("id", 2, "type", "Withdraw", "amount", 2000),
                Map.of("id", 3, "type", "Transfer", "amount", 1000)
        );
        return ResponseEntity.ok(history);
    }
}
