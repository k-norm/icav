package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityAccessibilityStats;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityAccessibilityRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FacilityAccessibilityServiceTest {

    @Mock
    private FacilityAccessibilityRepository facilityAccessibilityRepository;

    @InjectMocks
    private FacilityAccessibilityService facilityAccessibilityService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetFacilityAccessibilityByProvince() {
        FacilityAccessibilityData data = new FacilityAccessibilityData("Ontario", 1800, 400);

        when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                .thenReturn(List.of(data));

        List<FacilityAccessibilityData> result = facilityAccessibilityService.getFacilityAccessibilityByProvince();

        assertEquals(1, result.size());
        assertEquals("Ontario", result.get(0).getProvince());
        assertEquals(1800, result.get(0).getAccessible());
        assertEquals(400, result.get(0).getNotAccessible());
    }

    @Test
    void testGetFacilityAccessibilityStats() {
        FacilityAccessibilityData data = new FacilityAccessibilityData("Ontario", 1800, 400);

        when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                .thenReturn(List.of(data));

        List<FacilityAccessibilityStats> result = facilityAccessibilityService.getFacilityAccessibilityStats();

        assertEquals(1, result.size());
        assertEquals("Ontario", result.get(0).getProvince());
        assertEquals(1800, result.get(0).getAccessible());
        assertEquals(400, result.get(0).getNotAccessible());
        assertEquals(2200, result.get(0).getTotalFacilities());
        assertEquals(81.82, result.get(0).getAccessiblePercent());
    }
}