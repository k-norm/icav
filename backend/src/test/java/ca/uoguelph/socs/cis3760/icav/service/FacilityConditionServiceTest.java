package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityScatterData;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityConditionRepository;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityAccessibilityRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FacilityConditionServiceTest {

    @Mock
    private FacilityConditionRepository facilityConditionRepository;

    @Mock
    private FacilityAccessibilityRepository facilityAccessibilityRepository;

    @InjectMocks
    private FacilityConditionService facilityConditionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    // ---------- TEST getFacilityConditionByProvince ----------
    @Test
    void testGetFacilityConditionStats_Size() {

        FacilityConditionData data =
                new FacilityConditionData("Ontario", 100, 50, 30, 20);

        when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                .thenReturn(List.of(data));

        List<FacilityConditionStats> result =
                facilityConditionService.getFacilityConditionStats();

        assertEquals(1, result.size());
    }

    @Test
    void testGetFacilityScatterData() {
        FacilityConditionData conditionData = new FacilityConditionData("Ontario", 100, 50, 30, 20);
        ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData accessibilityData = new ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData("Ontario", 180, 40);

        when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                .thenReturn(List.of(conditionData));
        when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                .thenReturn(List.of(accessibilityData));

        List<FacilityScatterData> result = facilityConditionService.getFacilityScatterData();

        assertEquals(1, result.size());
        assertEquals("Ontario", result.get(0).getProvince());
        assertEquals(81.82, result.get(0).getAccessiblePercent());
        assertEquals(14.29, result.get(0).getPoorConditionPercent());
        assertEquals(200, result.get(0).getTotalFacilities());
    }
}