package fi.ramialkaro.tuudo.repository;

import fi.ramialkaro.tuudo.domain.TodoHistory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TodoHistory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TodoHistoryRepository extends JpaRepository<TodoHistory, Long> {}
