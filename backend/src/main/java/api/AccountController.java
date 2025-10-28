package api;

import entities.Account;
import entities.Customer;
import entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import repository.AccountRepository;
import repository.CustomerRepository;
import service.AuthService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AuthService authService;

    // ✅ CREATE ACCOUNT (fixed to use Authentication instead of Principal)
    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody AccountRequest request, Authentication authentication) {
        // Step 1: Check if authentication exists
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized: Please log in before creating an account.");
        }

        // Step 2: Extract username from JWT-authenticated user
        String username = authentication.getName();

        // Step 3: Find user
        User user = authService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Step 4: Find associated customer
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer not found for user: " + username));

        // Step 5: Create and save new account
        Account account = new Account();
        account.setCustomer(customer);
        account.setAccountType(request.getAccountType());
        account.setBalance(BigDecimal.valueOf(request.getInitialDeposit()));

        accountRepository.save(account);

        // Step 6: Return success response
        return ResponseEntity.ok(account);
    }

    // ✅ DTO for request body
    public static class AccountRequest {
        private String accountType;
        private double initialDeposit;

        public String getAccountType() {
            return accountType;
        }

        public void setAccountType(String accountType) {
            this.accountType = accountType;
        }

        public double getInitialDeposit() {
            return initialDeposit;
        }

        public void setInitialDeposit(double initialDeposit) {
            this.initialDeposit = initialDeposit;
        }
    }
}
