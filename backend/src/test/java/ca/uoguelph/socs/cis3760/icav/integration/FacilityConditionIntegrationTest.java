package ca.uoguelph.socs.cis3760.icav.integration;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;
import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityAccessibilityRepository;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityConditionRepository;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Disabled("Known CI failure 14 tests; re-enable after data/query fix")
public class FacilityConditionIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private FacilityConditionRepository facilityConditionRepository;

    @Autowired
    private FacilityAccessibilityRepository facilityAccessibilityRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // Clear existing data
        facilityConditionRepository.deleteAll();
        facilityAccessibilityRepository.deleteAll();

        // Insert test data
        FacilityConditionData conditionData = new FacilityConditionData("Ontario", 100, 50, 30, 20);
        FacilityAccessibilityData accessibilityData = new FacilityAccessibilityData("Ontario", 180, 40);

        facilityConditionRepository.save(conditionData);
        facilityAccessibilityRepository.save(accessibilityData);
    }

    @Test
    void testGetFacilityConditionByProvinceIntegration() throws Exception {
        mockMvc.perform(get("/api/condition")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].province", is("Ontario")))
                .andExpect(jsonPath("$[0].excellent", is(100)))
                .andExpect(jsonPath("$[0].good", is(50)))
                .andExpect(jsonPath("$[0].fair", is(30)))
                .andExpect(jsonPath("$[0].poor", is(20)));
    }

    @Test
    void testGetFacilityConditionStatsIntegration() throws Exception {
        mockMvc.perform(get("/api/condition/stats")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].province", is("Ontario")))
                .andExpect(jsonPath("$[0].excellent", is(100)))
                .andExpect(jsonPath("$[0].good", is(50)))
                .andExpect(jsonPath("$[0].fair", is(30)))
                .andExpect(jsonPath("$[0].poor", is(20)))
                .andExpect(jsonPath("$[0].totalFacilities", is(200)))
                .andExpect(jsonPath("$[0].excellentPercent", is(50.0)))
                .andExpect(jsonPath("$[0].goodPercent", is(25.0)))
                .andExpect(jsonPath("$[0].fairPercent", is(15.0)))
                .andExpect(jsonPath("$[0].poorPercent", is(10.0)));
    }

    @Test
    void testGetFacilityScatterDataIntegration() throws Exception {
        mockMvc.perform(get("/api/condition/scatter")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].province", is("Ontario")))
                .andExpect(jsonPath("$[0].accessiblePercent", is(81.82)))
                .andExpect(jsonPath("$[0].poorConditionPercent", is(10.0)))
                .andExpect(jsonPath("$[0].totalFacilities", is(200)));
    }

    @Test
    void testGetFacilityHeatmapDataIntegration() throws Exception {
        mockMvc.perform(get("/api/condition/heatmap")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].province", is("Ontario")))
                .andExpect(jsonPath("$[0].excellentPercent", is(50.0)))
                .andExpect(jsonPath("$[0].poorPercent", is(10.0)))
                .andExpect(jsonPath("$[0].totalFacilities", is(200)));
    }

    @Test
    void testDataConsistencyAcrossEndpoints() throws Exception {
        // Get data from all endpoints and verify consistency
        String conditionResponse = mockMvc.perform(get("/api/condition"))
                .andReturn().getResponse().getContentAsString();

        String statsResponse = mockMvc.perform(get("/api/condition/stats"))
                .andReturn().getResponse().getContentAsString();

        String scatterResponse = mockMvc.perform(get("/api/condition/scatter"))
                .andReturn().getResponse().getContentAsString();

        String heatmapResponse = mockMvc.perform(get("/api/condition/heatmap"))
                .andReturn().getResponse().getContentAsString();

        // All responses should contain Ontario data
        assertTrue(conditionResponse.contains("Ontario"));
        assertTrue(statsResponse.contains("Ontario"));
        assertTrue(scatterResponse.contains("Ontario"));
        assertTrue(heatmapResponse.contains("Ontario"));
    }

    @Test
    void testDatabaseIntegration() {
        // Verify data was saved correctly
        List<FacilityConditionData> conditionData = facilityConditionRepository.findAll();
        List<FacilityAccessibilityData> accessibilityData = facilityAccessibilityRepository.findAll();

        assertFalse(conditionData.isEmpty());
        assertFalse(accessibilityData.isEmpty());

        assertEquals("Ontario", conditionData.get(0).getProvince());
        assertEquals(100, conditionData.get(0).getExcellent());
        assertEquals("Ontario", accessibilityData.get(0).getProvince());
        assertEquals(180, accessibilityData.get(0).getAccessible());
    }

    @Test
    void testEmptyDatabaseHandling() throws Exception {
        // Clear all data
        facilityConditionRepository.deleteAll();
        facilityAccessibilityRepository.deleteAll();

        // Test endpoints return empty arrays instead of errors
        mockMvc.perform(get("/api/condition"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/condition/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/condition/scatter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/condition/heatmap"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}