package service;

import entities.User;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    User saveUser(User user);
}
