package api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardApiController {

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        // Example summary
        Map<String, Object> summary = Map.of(
                "totalBalance", 25000,
                "recentTransactions", 5,
                "savingsAccount", 15000,
                "currentAccount", 10000
        );
        return ResponseEntity.ok(summary);
    }
}
