package ca.uoguelph.socs.cis3760.icav.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;

@DataJpaTest
public class FacilityAccessibilityRepositoryTest {

    @Autowired
    private FacilityAccessibilityRepository facilityAccessibilityRepository;

    @Test
    void testFindAllByOrderByProvinceAsc_ReturnsOrderedData() {
        // Given
        FacilityAccessibilityData data1 = new FacilityAccessibilityData("Ontario", 180, 40);
        FacilityAccessibilityData data2 = new FacilityAccessibilityData("Quebec", 160, 20);
        facilityAccessibilityRepository.save(data1);
        facilityAccessibilityRepository.save(data2);

        // When
        List<FacilityAccessibilityData> result = facilityAccessibilityRepository.findAllByOrderByProvinceAsc();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        // Verify ordering by province
        assertTrue(result.get(0).getProvince().compareTo(result.get(1).getProvince()) <= 0);
    }

    @Test
    void testFindAllByOrderByProvinceAsc_ReturnsAllData() {
        // Given
        FacilityAccessibilityData data = new FacilityAccessibilityData("Ontario", 180, 40);
        facilityAccessibilityRepository.save(data);

        // When
        List<FacilityAccessibilityData> result = facilityAccessibilityRepository.findAllByOrderByProvinceAsc();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Ontario", result.get(0).getProvince());
        assertEquals(180, result.get(0).getAccessible());
        assertEquals(40, result.get(0).getNotAccessible());
    }

    @Test
    void testFindAllByOrderByProvinceAsc_EmptyDatabase() {
        // When
        List<FacilityAccessibilityData> result = facilityAccessibilityRepository.findAllByOrderByProvinceAsc();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void testRepositoryIsNotNull() {
        assertNotNull(facilityAccessibilityRepository);
    }

    @Test
    void testRepositoryExtendsJpaRepository() {
        // Verify that standard JPA methods are available
        assertDoesNotThrow(() -> facilityAccessibilityRepository.findAll());
        assertDoesNotThrow(() -> facilityAccessibilityRepository.count());
    }
}