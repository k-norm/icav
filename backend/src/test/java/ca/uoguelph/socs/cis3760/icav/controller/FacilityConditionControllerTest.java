package ca.uoguelph.socs.cis3760.icav.controller;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.service.FacilityConditionService;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityScatterData;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FacilityConditionControllerTest {

    @Mock
    private FacilityConditionService facilityConditionService;

    @InjectMocks
    private FacilityConditionController facilityConditionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetFacilityCondition_ReturnsOk() {

        when(facilityConditionService.getFacilityConditionByProvince())
                .thenReturn(List.of());

        ResponseEntity<List<FacilityConditionData>> response =
                facilityConditionController.getFacilityCondition();

        assertEquals(200, response.getStatusCodeValue());
    }
    @Test
    void testGetFacilityConditionStats_ReturnsData() {

        when(facilityConditionService.getFacilityConditionStats())
                .thenReturn(List.of());

        ResponseEntity<List<FacilityConditionStats>> response =
                facilityConditionController.getFacilityConditionStats();

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void testGetFacilityScatterData_ReturnsData() {
        when(facilityConditionService.getFacilityScatterData())
                .thenReturn(List.of());

        ResponseEntity<List<FacilityScatterData>> response =
                facilityConditionController.getFacilityScatterData();

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }
}