package service;

import entities.Customer;
import entities.User;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    List<Customer> findAll();

    Optional<Customer> findById(Long id);

    Customer save(Customer customer);

    void deleteById(Long id);

    // Find customer by User entity
    Optional<Customer> findByUser(User user);

    // Find customer by User ID
    Customer findByUserId(Long userId);
}
