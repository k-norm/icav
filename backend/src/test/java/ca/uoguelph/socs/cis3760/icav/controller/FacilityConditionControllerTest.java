package ca.uoguelph.socs.cis3760.icav.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityHeatmapData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityScatterData;
import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.service.FacilityConditionService;

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
                // Given
                List<FacilityConditionData> mockData = Arrays.asList(
                                new FacilityConditionData("Ontario", 100, 50, 30, 20),
                                new FacilityConditionData("Quebec", 80, 40, 25, 15));

                when(facilityConditionService.getFacilityConditionByProvince())
                                .thenReturn(mockData);

                // When
                ResponseEntity<List<FacilityConditionData>> response = facilityConditionController
                                .getFacilityCondition();

                // Then
                assertEquals(200, response.getStatusCodeValue());
                assertNotNull(response.getBody());
                assertEquals(2, response.getBody().size());
                assertEquals("Ontario", response.getBody().get(0).getProvince());
                verify(facilityConditionService, times(1)).getFacilityConditionByProvince();
        }

        @Test
        void testGetFacilityCondition_ReturnsEmptyList() {
                // Given
                when(facilityConditionService.getFacilityConditionByProvince())
                                .thenReturn(List.of());

                // When
                ResponseEntity<List<FacilityConditionData>> response = facilityConditionController
                                .getFacilityCondition();

                // Then
                assertEquals(200, response.getStatusCodeValue());
                assertNotNull(response.getBody());
                assertTrue(response.getBody().isEmpty());
        }

        @Test
        void testGetFacilityConditionStats_ReturnsData() {
                // Given
                List<FacilityConditionStats> mockStats = Arrays.asList(
                                new FacilityConditionStats("Ontario", 100, 50, 30, 20, 200, 50.0, 25.0, 15.0, 10.0),
                                new FacilityConditionStats("Quebec", 80, 40, 25, 15, 160, 50.0, 25.0, 15.63, 9.38));

                when(facilityConditionService.getFacilityConditionStats())
                                .thenReturn(mockStats);

                // When
                ResponseEntity<List<FacilityConditionStats>> response = facilityConditionController
                                .getFacilityConditionStats();

                // Then
                assertNotNull(response);
                assertEquals(200, response.getStatusCodeValue());
                assertNotNull(response.getBody());
                assertEquals(2, response.getBody().size());
                assertEquals("Ontario", response.getBody().get(0).getProvince());
                assertEquals(50.0, response.getBody().get(0).getExcellentPercent());
                verify(facilityConditionService, times(1)).getFacilityConditionStats();
        }

        @Test
        void testGetFacilityConditionStats_ReturnsEmptyList() {
                // Given
                when(facilityConditionService.getFacilityConditionStats())
                                .thenReturn(List.of());

                // When
                ResponseEntity<List<FacilityConditionStats>> response = facilityConditionController
                                .getFacilityConditionStats();

                // Then
                assertNotNull(response);
                assertEquals(200, response.getStatusCodeValue());
                assertTrue(response.getBody().isEmpty());
        }

        @Test
        void testGetFacilityScatterData_ReturnsData() {
                // Given
                List<FacilityScatterData> mockData = Arrays.asList(
                                new FacilityScatterData("Ontario", 81.82, 10.0, 200),
                                new FacilityScatterData("Quebec", 75.0, 12.5, 160));

                when(facilityConditionService.getFacilityScatterData())
                                .thenReturn(mockData);

                // When
                ResponseEntity<List<FacilityScatterData>> response = facilityConditionController
                                .getFacilityScatterData();

                // Then
                assertNotNull(response);
                assertEquals(200, response.getStatusCodeValue());
                assertNotNull(response.getBody());
                assertEquals(2, response.getBody().size());
                assertEquals("Ontario", response.getBody().get(0).getProvince());
                assertEquals(81.82, response.getBody().get(0).getAccessiblePercent());
                verify(facilityConditionService, times(1)).getFacilityScatterData();
        }

        @Test
        void testGetFacilityScatterData_ReturnsEmptyList() {
                // Given
                when(facilityConditionService.getFacilityScatterData())
                                .thenReturn(List.of());

                // When
                ResponseEntity<List<FacilityScatterData>> response = facilityConditionController
                                .getFacilityScatterData();

                // Then
                assertNotNull(response);
                assertEquals(200, response.getStatusCodeValue());
                assertTrue(response.getBody().isEmpty());
        }

        @Test
        void testGetFacilityHeatmapData_ReturnsData() {
                // Given
                List<FacilityHeatmapData> mockData = Arrays.asList(
                                new FacilityHeatmapData("Ontario", 50.0, 10.0, 200),
                                new FacilityHeatmapData("Quebec", 50.0, 9.38, 160));

                when(facilityConditionService.getFacilityHeatmapData())
                                .thenReturn(mockData);

                // When
                ResponseEntity<List<FacilityHeatmapData>> response = facilityConditionController
                                .getFacilityHeatmapData();

                // Then
                assertNotNull(response);
                assertEquals(200, response.getStatusCodeValue());
                assertNotNull(response.getBody());
                assertEquals(2, response.getBody().size());
                assertEquals("Ontario", response.getBody().get(0).getProvince());
                assertEquals(50.0, response.getBody().get(0).getExcellentPercent());
                assertEquals(10.0, response.getBody().get(0).getPoorPercent());
                verify(facilityConditionService, times(1)).getFacilityHeatmapData();
        }

        @Test
        void testGetFacilityHeatmapData_ReturnsEmptyList() {
                // Given
                when(facilityConditionService.getFacilityHeatmapData())
                                .thenReturn(List.of());

                // When
                ResponseEntity<List<FacilityHeatmapData>> response = facilityConditionController
                                .getFacilityHeatmapData();

                // Then
                assertNotNull(response);
                assertEquals(200, response.getStatusCodeValue());
                assertTrue(response.getBody().isEmpty());
        }

        @Test
        void testGetFacilityHeatmapData_ServiceThrowsException() {
                // Given
                when(facilityConditionService.getFacilityHeatmapData())
                                .thenThrow(new RuntimeException("Database error"));

                // When & Then
                assertThrows(RuntimeException.class, () -> {
                        facilityConditionController.getFacilityHeatmapData();
                });
                verify(facilityConditionService, times(1)).getFacilityHeatmapData();
        }
}