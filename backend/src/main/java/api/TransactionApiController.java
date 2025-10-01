package com.bank.api;

import com.yourbank.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TransactionApiController {

    private final TransactionService transactionService;

    public TransactionApiController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestParam String fromAccount,
                                      @RequestParam String toAccount,
                                      @RequestParam double amount,
                                      Principal principal) {
        transactionService.transfer(fromAccount, toAccount, amount);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(Principal principal) {
        var list = transactionService.getHistory(principal.getName());
        return ResponseEntity.ok(list);
    }
}
