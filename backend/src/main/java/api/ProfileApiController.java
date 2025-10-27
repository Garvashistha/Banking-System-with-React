package api;

import entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import service.UserServiceImpl;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileApiController {

    private final UserServiceImpl userService;

    @Autowired
    public ProfileApiController(UserServiceImpl userService) {
        this.userService = userService;
    }

    /**
     * Get the currently authenticated user's profile
     */
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "phone", user.getPhone(),
                "address", user.getAddress(),
                "role", user.getRole()
        );

        return ResponseEntity.ok(profile);
    }

    /**
     * Update the currently authenticated user's profile
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Authentication authentication) {
        String username = authentication.getName();
        User existingUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        updatedUser.setId(existingUser.getId()); // ensure same user
        User savedUser = userService.updateUserProfile(existingUser.getId(), updatedUser);

        Map<String, Object> response = Map.of(
                "message", "Profile updated successfully",
                "user", Map.of(
                        "firstName", savedUser.getFirstName(),
                        "lastName", savedUser.getLastName(),
                        "email", savedUser.getEmail(),
                        "phone", savedUser.getPhone(),
                        "address", savedUser.getAddress()
                )
        );

        return ResponseEntity.ok(response);
    }
}
