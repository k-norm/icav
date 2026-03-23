package ca.uoguelph.socs.cis3760.icav.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityHeatmapData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityScatterData;
import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityAccessibilityRepository;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityConditionRepository;

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
        void testGetFacilityConditionByProvince_ReturnsData() {
                // Given
                List<FacilityConditionData> mockData = Arrays.asList(
                                new FacilityConditionData("Ontario", 100, 50, 30, 20),
                                new FacilityConditionData("Quebec", 80, 40, 25, 15));

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(mockData);

                // When
                List<FacilityConditionData> result = facilityConditionService.getFacilityConditionByProvince();

                // Then
                assertNotNull(result);
                assertEquals(2, result.size());
                assertEquals("Ontario", result.get(0).getProvince());
                assertEquals(100, result.get(0).getExcellent());
                verify(facilityConditionRepository, times(1)).findAllByOrderByProvinceAsc();
        }

        @Test
        void testGetFacilityConditionByProvince_ReturnsEmptyList() {
                // Given
                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of());

                // When
                List<FacilityConditionData> result = facilityConditionService.getFacilityConditionByProvince();

                // Then
                assertNotNull(result);
                assertTrue(result.isEmpty());
                verify(facilityConditionRepository, times(1)).findAllByOrderByProvinceAsc();
        }

        // ---------- TEST getFacilityConditionStats ----------
        @Test
        void testGetFacilityConditionStats_CalculatesPercentagesCorrectly() {
                // Given
                FacilityConditionData data = new FacilityConditionData("Ontario", 100, 50, 30, 20);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(data));

                // When
                List<FacilityConditionStats> result = facilityConditionService.getFacilityConditionStats();

                // Then
                assertEquals(1, result.size());
                FacilityConditionStats stats = result.get(0);
                assertEquals("Ontario", stats.getProvince());
                assertEquals(100, stats.getExcellent());
                assertEquals(50, stats.getGood());
                assertEquals(30, stats.getFair());
                assertEquals(20, stats.getPoor());
                assertEquals(200, stats.getTotalFacilities());
                assertEquals(50.0, stats.getExcellentPercent());
                assertEquals(25.0, stats.getGoodPercent());
                assertEquals(15.0, stats.getFairPercent());
                assertEquals(10.0, stats.getPoorPercent());
        }

        @Test
        void testGetFacilityConditionStats_MultipleProvinces() {
                // Given
                List<FacilityConditionData> mockData = Arrays.asList(
                                new FacilityConditionData("Ontario", 100, 50, 30, 20),
                                new FacilityConditionData("Quebec", 80, 40, 25, 15));

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(mockData);

                // When
                List<FacilityConditionStats> result = facilityConditionService.getFacilityConditionStats();

                // Then
                assertEquals(2, result.size());
                assertEquals("Ontario", result.get(0).getProvince());
                assertEquals("Quebec", result.get(1).getProvince());
                assertEquals(50.0, result.get(0).getExcellentPercent());
                assertEquals(50.0, result.get(1).getExcellentPercent());
        }

        @Test
        void testGetFacilityConditionStats_ZeroTotalFacilities() {
                // Given
                FacilityConditionData data = new FacilityConditionData("Ontario", 0, 0, 0, 0);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(data));

                // When
                List<FacilityConditionStats> result = facilityConditionService.getFacilityConditionStats();

                // Then
                assertEquals(1, result.size());
                FacilityConditionStats stats = result.get(0);
                assertEquals(0, stats.getTotalFacilities());
                assertEquals(0.0, stats.getExcellentPercent());
                assertEquals(0.0, stats.getGoodPercent());
                assertEquals(0.0, stats.getFairPercent());
                assertEquals(0.0, stats.getPoorPercent());
        }

        // ---------- TEST getFacilityScatterData ----------
        @Test
        void testGetFacilityScatterData() {
                // Given
                FacilityConditionData conditionData = new FacilityConditionData("Ontario", 100, 50, 30, 20);
                ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData accessibilityData = new ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData(
                                "Ontario", 180, 40);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(conditionData));
                when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(accessibilityData));

                // When
                List<FacilityScatterData> result = facilityConditionService.getFacilityScatterData();

                // Then
                assertEquals(1, result.size());
                assertEquals("Ontario", result.get(0).getProvince());
                assertEquals(81.82, result.get(0).getAccessiblePercent());
                assertEquals(10.0, result.get(0).getPoorConditionPercent());
                assertEquals(200, result.get(0).getTotalFacilities());
        }

        @Test
        void testGetFacilityScatterData_MultipleProvinces() {
                // Given
                List<FacilityConditionData> conditionData = Arrays.asList(
                                new FacilityConditionData("Ontario", 100, 50, 30, 20),
                                new FacilityConditionData("Quebec", 80, 40, 25, 15));
                List<ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData> accessibilityData = Arrays.asList(
                                new ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData("Ontario", 180, 40),
                                new ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData("Quebec", 160, 20));

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(conditionData);
                when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(accessibilityData);

                // When
                List<FacilityScatterData> result = facilityConditionService.getFacilityScatterData();

                // Then
                assertEquals(2, result.size());

                // Find Ontario and Quebec data (order may vary)
                FacilityScatterData ontarioData = result.stream()
                                .filter(data -> "Ontario".equals(data.getProvince()))
                                .findFirst().orElse(null);
                FacilityScatterData quebecData = result.stream()
                                .filter(data -> "Quebec".equals(data.getProvince()))
                                .findFirst().orElse(null);

                assertNotNull(ontarioData);
                assertNotNull(quebecData);
                assertEquals(81.82, ontarioData.getAccessiblePercent());
                assertEquals(88.89, quebecData.getAccessiblePercent());
        }

        @Test
        void testGetFacilityScatterData_NoMatchingProvinces() {
                // Given
                FacilityConditionData conditionData = new FacilityConditionData("Ontario", 100, 50, 30, 20);
                ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData accessibilityData = new ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData(
                                "Quebec", 180, 40);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(conditionData));
                when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(accessibilityData));

                // When
                List<FacilityScatterData> result = facilityConditionService.getFacilityScatterData();

                // Then
                assertTrue(result.isEmpty());
        }

        @Test
        void testGetFacilityScatterData_ZeroAccessibilityTotal() {
                // Given
                FacilityConditionData conditionData = new FacilityConditionData("Ontario", 100, 50, 30, 20);
                ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData accessibilityData = new ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData(
                                "Ontario", 0, 0);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(conditionData));
                when(facilityAccessibilityRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(accessibilityData));

                // When
                List<FacilityScatterData> result = facilityConditionService.getFacilityScatterData();

                // Then
                assertEquals(1, result.size());
                assertEquals(0.0, result.get(0).getAccessiblePercent());
        }

        // ---------- TEST getFacilityHeatmapData ----------
        @Test
        void testGetFacilityHeatmapData() {
                // Given
                FacilityConditionData conditionData = new FacilityConditionData("Ontario", 100, 50, 30, 20);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(conditionData));

                // When
                List<FacilityHeatmapData> result = facilityConditionService.getFacilityHeatmapData();

                // Then
                assertEquals(1, result.size());
                assertEquals("Ontario", result.get(0).getProvince());
                assertEquals(50.0, result.get(0).getExcellentPercent());
                assertEquals(10.0, result.get(0).getPoorPercent());
                assertEquals(200, result.get(0).getTotalFacilities());
        }

        @Test
        void testGetFacilityHeatmapData_ZeroTotalFacilities() {
                // Given
                FacilityConditionData conditionData = new FacilityConditionData("Ontario", 0, 0, 0, 0);

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(List.of(conditionData));

                // When
                List<FacilityHeatmapData> result = facilityConditionService.getFacilityHeatmapData();

                // Then
                assertEquals(1, result.size());
                assertEquals("Ontario", result.get(0).getProvince());
                assertEquals(0.0, result.get(0).getExcellentPercent());
                assertEquals(0.0, result.get(0).getPoorPercent());
                assertEquals(0, result.get(0).getTotalFacilities());
        }

        @Test
        void testGetFacilityHeatmapData_MultipleProvinces() {
                // Given
                List<FacilityConditionData> mockData = Arrays.asList(
                                new FacilityConditionData("Ontario", 100, 50, 30, 20),
                                new FacilityConditionData("Quebec", 80, 40, 25, 15));

                when(facilityConditionRepository.findAllByOrderByProvinceAsc())
                                .thenReturn(mockData);

                // When
                List<FacilityHeatmapData> result = facilityConditionService.getFacilityHeatmapData();

                // Then
                assertEquals(2, result.size());
                assertEquals("Ontario", result.get(0).getProvince());
                assertEquals("Quebec", result.get(1).getProvince());
                assertEquals(50.0, result.get(0).getExcellentPercent());
                assertEquals(50.0, result.get(1).getExcellentPercent());
        }
}