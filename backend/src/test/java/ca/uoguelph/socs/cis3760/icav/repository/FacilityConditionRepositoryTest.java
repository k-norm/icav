package ca.uoguelph.socs.cis3760.icav.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;

@DataJpaTest
public class FacilityConditionRepositoryTest {

    @Autowired
    private FacilityConditionRepository facilityConditionRepository;

    @Test
    void testFindAllByOrderByProvinceAsc_ReturnsOrderedData() {
        // Given
        FacilityConditionData data1 = new FacilityConditionData("Ontario", 100, 50, 30, 20);
        FacilityConditionData data2 = new FacilityConditionData("Quebec", 80, 40, 25, 15);
        facilityConditionRepository.save(data1);
        facilityConditionRepository.save(data2);

        // When
        List<FacilityConditionData> result = facilityConditionRepository.findAllByOrderByProvinceAsc();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        // Verify ordering by province
        assertTrue(result.get(0).getProvince().compareTo(result.get(1).getProvince()) <= 0);
    }

    @Test
    void testFindAllByOrderByProvinceAsc_ReturnsAllData() {
        // Given
        FacilityConditionData data = new FacilityConditionData("Ontario", 100, 50, 30, 20);
        facilityConditionRepository.save(data);

        // When
        List<FacilityConditionData> result = facilityConditionRepository.findAllByOrderByProvinceAsc();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Ontario", result.get(0).getProvince());
        assertEquals(100, result.get(0).getExcellent());
        assertEquals(50, result.get(0).getGood());
        assertEquals(30, result.get(0).getFair());
        assertEquals(20, result.get(0).getPoor());
    }

    @Test
    void testFindAllByOrderByProvinceAsc_EmptyDatabase() {
        // When
        List<FacilityConditionData> result = facilityConditionRepository.findAllByOrderByProvinceAsc();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testRepositoryIsNotNull() {
        assertNotNull(facilityConditionRepository);
    }

    @Test
    void testRepositoryExtendsJpaRepository() {
        // Verify that standard JPA methods are available
        assertDoesNotThrow(() -> facilityConditionRepository.findAll());
        assertDoesNotThrow(() -> facilityConditionRepository.count());
    }
}