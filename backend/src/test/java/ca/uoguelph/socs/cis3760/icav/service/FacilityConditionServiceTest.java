package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityConditionRepository;

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
}