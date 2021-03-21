package fi.ramialkaro.tuudo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fi.ramialkaro.tuudo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TodoHistoryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TodoHistory.class);
        TodoHistory todoHistory1 = new TodoHistory();
        todoHistory1.setId(1L);
        TodoHistory todoHistory2 = new TodoHistory();
        todoHistory2.setId(todoHistory1.getId());
        assertThat(todoHistory1).isEqualTo(todoHistory2);
        todoHistory2.setId(2L);
        assertThat(todoHistory1).isNotEqualTo(todoHistory2);
        todoHistory1.setId(null);
        assertThat(todoHistory1).isNotEqualTo(todoHistory2);
    }
}
