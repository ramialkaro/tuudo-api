package fi.ramialkaro.tuudo.web.rest;

import fi.ramialkaro.tuudo.domain.TodoHistory;
import fi.ramialkaro.tuudo.repository.TodoHistoryRepository;
import fi.ramialkaro.tuudo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fi.ramialkaro.tuudo.domain.TodoHistory}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TodoHistoryResource {

    private final Logger log = LoggerFactory.getLogger(TodoHistoryResource.class);

    private static final String ENTITY_NAME = "todoHistory";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TodoHistoryRepository todoHistoryRepository;

    public TodoHistoryResource(TodoHistoryRepository todoHistoryRepository) {
        this.todoHistoryRepository = todoHistoryRepository;
    }

    /**
     * {@code POST  /todo-histories} : Create a new todoHistory.
     *
     * @param todoHistory the todoHistory to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new todoHistory, or with status {@code 400 (Bad Request)} if the todoHistory has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/todo-histories")
    public ResponseEntity<TodoHistory> createTodoHistory(@RequestBody TodoHistory todoHistory) throws URISyntaxException {
        log.debug("REST request to save TodoHistory : {}", todoHistory);
        if (todoHistory.getId() != null) {
            throw new BadRequestAlertException("A new todoHistory cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TodoHistory result = todoHistoryRepository.save(todoHistory);
        return ResponseEntity
            .created(new URI("/api/todo-histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /todo-histories/:id} : Updates an existing todoHistory.
     *
     * @param id the id of the todoHistory to save.
     * @param todoHistory the todoHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoHistory,
     * or with status {@code 400 (Bad Request)} if the todoHistory is not valid,
     * or with status {@code 500 (Internal Server Error)} if the todoHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/todo-histories/{id}")
    public ResponseEntity<TodoHistory> updateTodoHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TodoHistory todoHistory
    ) throws URISyntaxException {
        log.debug("REST request to update TodoHistory : {}, {}", id, todoHistory);
        if (todoHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TodoHistory result = todoHistoryRepository.save(todoHistory);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoHistory.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /todo-histories/:id} : Partial updates given fields of an existing todoHistory, field will ignore if it is null
     *
     * @param id the id of the todoHistory to save.
     * @param todoHistory the todoHistory to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todoHistory,
     * or with status {@code 400 (Bad Request)} if the todoHistory is not valid,
     * or with status {@code 404 (Not Found)} if the todoHistory is not found,
     * or with status {@code 500 (Internal Server Error)} if the todoHistory couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/todo-histories/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<TodoHistory> partialUpdateTodoHistory(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TodoHistory todoHistory
    ) throws URISyntaxException {
        log.debug("REST request to partial update TodoHistory partially : {}, {}", id, todoHistory);
        if (todoHistory.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todoHistory.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todoHistoryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TodoHistory> result = todoHistoryRepository
            .findById(todoHistory.getId())
            .map(
                existingTodoHistory -> {
                    if (todoHistory.getStartAt() != null) {
                        existingTodoHistory.setStartAt(todoHistory.getStartAt());
                    }
                    if (todoHistory.getEndAt() != null) {
                        existingTodoHistory.setEndAt(todoHistory.getEndAt());
                    }

                    return existingTodoHistory;
                }
            )
            .map(todoHistoryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todoHistory.getId().toString())
        );
    }

    /**
     * {@code GET  /todo-histories} : get all the todoHistories.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todoHistories in body.
     */
    @GetMapping("/todo-histories")
    public ResponseEntity<List<TodoHistory>> getAllTodoHistories(Pageable pageable) {
        log.debug("REST request to get a page of TodoHistories");
        Page<TodoHistory> page = todoHistoryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /todo-histories/:id} : get the "id" todoHistory.
     *
     * @param id the id of the todoHistory to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the todoHistory, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/todo-histories/{id}")
    public ResponseEntity<TodoHistory> getTodoHistory(@PathVariable Long id) {
        log.debug("REST request to get TodoHistory : {}", id);
        Optional<TodoHistory> todoHistory = todoHistoryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(todoHistory);
    }

    /**
     * {@code DELETE  /todo-histories/:id} : delete the "id" todoHistory.
     *
     * @param id the id of the todoHistory to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/todo-histories/{id}")
    public ResponseEntity<Void> deleteTodoHistory(@PathVariable Long id) {
        log.debug("REST request to delete TodoHistory : {}", id);
        todoHistoryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
