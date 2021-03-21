package fi.ramialkaro.tuudo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fi.ramialkaro.tuudo.IntegrationTest;
import fi.ramialkaro.tuudo.domain.TodoHistory;
import fi.ramialkaro.tuudo.repository.TodoHistoryRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TodoHistoryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TodoHistoryResourceIT {

    private static final Instant DEFAULT_START_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/todo-histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodoHistoryRepository todoHistoryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodoHistoryMockMvc;

    private TodoHistory todoHistory;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoHistory createEntity(EntityManager em) {
        TodoHistory todoHistory = new TodoHistory().startAt(DEFAULT_START_AT).endAt(DEFAULT_END_AT);
        return todoHistory;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodoHistory createUpdatedEntity(EntityManager em) {
        TodoHistory todoHistory = new TodoHistory().startAt(UPDATED_START_AT).endAt(UPDATED_END_AT);
        return todoHistory;
    }

    @BeforeEach
    public void initTest() {
        todoHistory = createEntity(em);
    }

    @Test
    @Transactional
    void createTodoHistory() throws Exception {
        int databaseSizeBeforeCreate = todoHistoryRepository.findAll().size();
        // Create the TodoHistory
        restTodoHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoHistory)))
            .andExpect(status().isCreated());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeCreate + 1);
        TodoHistory testTodoHistory = todoHistoryList.get(todoHistoryList.size() - 1);
        assertThat(testTodoHistory.getStartAt()).isEqualTo(DEFAULT_START_AT);
        assertThat(testTodoHistory.getEndAt()).isEqualTo(DEFAULT_END_AT);
    }

    @Test
    @Transactional
    void createTodoHistoryWithExistingId() throws Exception {
        // Create the TodoHistory with an existing ID
        todoHistory.setId(1L);

        int databaseSizeBeforeCreate = todoHistoryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodoHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoHistory)))
            .andExpect(status().isBadRequest());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTodoHistories() throws Exception {
        // Initialize the database
        todoHistoryRepository.saveAndFlush(todoHistory);

        // Get all the todoHistoryList
        restTodoHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todoHistory.getId().intValue())))
            .andExpect(jsonPath("$.[*].startAt").value(hasItem(DEFAULT_START_AT.toString())))
            .andExpect(jsonPath("$.[*].endAt").value(hasItem(DEFAULT_END_AT.toString())));
    }

    @Test
    @Transactional
    void getTodoHistory() throws Exception {
        // Initialize the database
        todoHistoryRepository.saveAndFlush(todoHistory);

        // Get the todoHistory
        restTodoHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, todoHistory.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todoHistory.getId().intValue()))
            .andExpect(jsonPath("$.startAt").value(DEFAULT_START_AT.toString()))
            .andExpect(jsonPath("$.endAt").value(DEFAULT_END_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTodoHistory() throws Exception {
        // Get the todoHistory
        restTodoHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTodoHistory() throws Exception {
        // Initialize the database
        todoHistoryRepository.saveAndFlush(todoHistory);

        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();

        // Update the todoHistory
        TodoHistory updatedTodoHistory = todoHistoryRepository.findById(todoHistory.getId()).get();
        // Disconnect from session so that the updates on updatedTodoHistory are not directly saved in db
        em.detach(updatedTodoHistory);
        updatedTodoHistory.startAt(UPDATED_START_AT).endAt(UPDATED_END_AT);

        restTodoHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTodoHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTodoHistory))
            )
            .andExpect(status().isOk());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
        TodoHistory testTodoHistory = todoHistoryList.get(todoHistoryList.size() - 1);
        assertThat(testTodoHistory.getStartAt()).isEqualTo(UPDATED_START_AT);
        assertThat(testTodoHistory.getEndAt()).isEqualTo(UPDATED_END_AT);
    }

    @Test
    @Transactional
    void putNonExistingTodoHistory() throws Exception {
        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();
        todoHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todoHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodoHistory() throws Exception {
        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();
        todoHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todoHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodoHistory() throws Exception {
        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();
        todoHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoHistoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todoHistory)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodoHistoryWithPatch() throws Exception {
        // Initialize the database
        todoHistoryRepository.saveAndFlush(todoHistory);

        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();

        // Update the todoHistory using partial update
        TodoHistory partialUpdatedTodoHistory = new TodoHistory();
        partialUpdatedTodoHistory.setId(todoHistory.getId());

        partialUpdatedTodoHistory.startAt(UPDATED_START_AT);

        restTodoHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoHistory))
            )
            .andExpect(status().isOk());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
        TodoHistory testTodoHistory = todoHistoryList.get(todoHistoryList.size() - 1);
        assertThat(testTodoHistory.getStartAt()).isEqualTo(UPDATED_START_AT);
        assertThat(testTodoHistory.getEndAt()).isEqualTo(DEFAULT_END_AT);
    }

    @Test
    @Transactional
    void fullUpdateTodoHistoryWithPatch() throws Exception {
        // Initialize the database
        todoHistoryRepository.saveAndFlush(todoHistory);

        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();

        // Update the todoHistory using partial update
        TodoHistory partialUpdatedTodoHistory = new TodoHistory();
        partialUpdatedTodoHistory.setId(todoHistory.getId());

        partialUpdatedTodoHistory.startAt(UPDATED_START_AT).endAt(UPDATED_END_AT);

        restTodoHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodoHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodoHistory))
            )
            .andExpect(status().isOk());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
        TodoHistory testTodoHistory = todoHistoryList.get(todoHistoryList.size() - 1);
        assertThat(testTodoHistory.getStartAt()).isEqualTo(UPDATED_START_AT);
        assertThat(testTodoHistory.getEndAt()).isEqualTo(UPDATED_END_AT);
    }

    @Test
    @Transactional
    void patchNonExistingTodoHistory() throws Exception {
        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();
        todoHistory.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodoHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todoHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodoHistory() throws Exception {
        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();
        todoHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todoHistory))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodoHistory() throws Exception {
        int databaseSizeBeforeUpdate = todoHistoryRepository.findAll().size();
        todoHistory.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodoHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(todoHistory))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodoHistory in the database
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodoHistory() throws Exception {
        // Initialize the database
        todoHistoryRepository.saveAndFlush(todoHistory);

        int databaseSizeBeforeDelete = todoHistoryRepository.findAll().size();

        // Delete the todoHistory
        restTodoHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, todoHistory.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TodoHistory> todoHistoryList = todoHistoryRepository.findAll();
        assertThat(todoHistoryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
