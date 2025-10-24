package api;

import entities.Account;
import entities.Customer;
import entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.AccountRepository;
import repository.CustomerRepository;
import service.AuthService;

import java.math.BigDecimal;
import java.security.Principal;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody AccountRequest request, Principal principal) {
        // Step 1: Find logged-in user
        User user = authService.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2: Find linked customer for this user
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer not found for this user"));

        // Step 3: Create new account
        Account account = new Account();
        account.setCustomer(customer);
        account.setAccountType(request.getAccountType());
        account.setBalance(BigDecimal.valueOf(request.getInitialDeposit()));

        // Step 4: Save and return
        accountRepository.save(account);
        return ResponseEntity.ok(account);
    }

    // ✅ DTO class
    public static class AccountRequest {
        private String accountType;
        private double initialDeposit;

        public String getAccountType() { return accountType; }
        public void setAccountType(String accountType) { this.accountType = accountType; }
        public double getInitialDeposit() { return initialDeposit; }
        public void setInitialDeposit(double initialDeposit) { this.initialDeposit = initialDeposit; }
    }
}
