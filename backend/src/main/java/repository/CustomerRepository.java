package repository;

import entities.Customer;
import entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Finds customer by User ID
    Optional<Customer> findByUser_Id(Long userId);

    // Finds customer by User entity itself
    Optional<Customer> findByUser(User user);
}
