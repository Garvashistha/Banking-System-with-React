package com.org.bank.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

    @PostMapping("/login-success")
    public ResponseEntity<?> loginSuccess() {
        // In real case, fetch authenticated user from SecurityContext
        return ResponseEntity.ok().body("{\"message\": \"Login successful\"}");
    }

    @PostMapping("/logout-success")
    public ResponseEntity<?> logoutSuccess() {
        return ResponseEntity.ok().body("{\"message\": \"Logout successful\"}");
    }
}
