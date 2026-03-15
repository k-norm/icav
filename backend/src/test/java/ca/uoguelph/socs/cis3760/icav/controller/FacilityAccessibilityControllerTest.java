package ca.uoguelph.socs.cis3760.icav.controller;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;
import ca.uoguelph.socs.cis3760.icav.service.FacilityAccessibilityService;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityAccessibilityStats;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FacilityAccessibilityControllerTest {

    @Mock
    private FacilityAccessibilityService facilityAccessibilityService;

    @InjectMocks
    private FacilityAccessibilityController facilityAccessibilityController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetFacilityAccessibility_ReturnsOk() {
        when(facilityAccessibilityService.getFacilityAccessibilityByProvince())
                .thenReturn(List.of());

        ResponseEntity<List<FacilityAccessibilityData>> response =
                facilityAccessibilityController.getFacilityAccessibility();

        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testGetFacilityAccessibilityStats_ReturnsData() {
        when(facilityAccessibilityService.getFacilityAccessibilityStats())
                .thenReturn(List.of());

        ResponseEntity<List<FacilityAccessibilityStats>> response =
                facilityAccessibilityController.getFacilityAccessibilityStats();

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().isEmpty());
    }
}