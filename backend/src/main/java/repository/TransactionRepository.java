package repository;

import entities.Customer;
import entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountAccountIdOrderByTimestampDesc(Long accountId);

    List<Transaction> findBySourceAccountAccountIdOrderByTimestampDesc(Long accountId);

    List<Transaction> findByDestinationAccountAccountIdOrderByTimestampDesc(Long accountId);

    // 🔑 Correct one for customer:
    List<Transaction> findByAccountCustomerOrderByTimestampDesc(Customer customer);
}
