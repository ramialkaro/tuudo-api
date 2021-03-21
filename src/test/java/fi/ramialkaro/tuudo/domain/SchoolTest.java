package fi.ramialkaro.tuudo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fi.ramialkaro.tuudo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SchoolTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(School.class);
        School school1 = new School();
        school1.setId(1L);
        School school2 = new School();
        school2.setId(school1.getId());
        assertThat(school1).isEqualTo(school2);
        school2.setId(2L);
        assertThat(school1).isNotEqualTo(school2);
        school1.setId(null);
        assertThat(school1).isNotEqualTo(school2);
    }
}
