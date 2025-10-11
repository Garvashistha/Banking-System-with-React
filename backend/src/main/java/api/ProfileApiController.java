package api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileApiController {

    @GetMapping
    public ResponseEntity<?> getProfile() {
        Map<String, Object> profile = Map.of(
                "name", "John Doe",
                "email", "john@example.com",
                "phone", "9876543210"
        );
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("message", "Profile updated", "profile", body));
    }
}
