package ca.uoguelph.socs.cis3760.icav.controller;

import ca.uoguelph.socs.cis3760.icav.dto.FacilityAccessibilityStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.service.FacilityAccessibilityService;
import ca.uoguelph.socs.cis3760.icav.service.FacilityConditionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({ FacilityConditionController.class, FacilityAccessibilityController.class })
public class ComparisonApiContractTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FacilityConditionService facilityConditionService;

    @MockBean
    private FacilityAccessibilityService facilityAccessibilityService;

    @Test
    void statsEndpointExposesConditionFieldsUsedByComparisonChart() throws Exception {
        when(facilityConditionService.getFacilityConditionStats()).thenReturn(List.of(
                new FacilityConditionStats("Ontario", 90, 70, 30, 10, 200, 45.0, 35.0, 15.0, 5.0)
        ));

        mockMvc.perform(get("/api/facilities/stats").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].province").value("Ontario"))
                .andExpect(jsonPath("$[0].good_percent").value(35.0))
                .andExpect(jsonPath("$[0].total_facilities").value(200))
                .andExpect(jsonPath("$[0].excellent_percent").value(45.0))
                .andExpect(jsonPath("$[0].poor_percent").value(5.0));
    }

    @Test
    void accessibilityStatsEndpointExposesMatchingJoinKeyAndAccessibilityPercentage() throws Exception {
        when(facilityAccessibilityService.getFacilityAccessibilityStats()).thenReturn(List.of(
                new FacilityAccessibilityStats("Ontario", 160, 40, 200, 80.0)
        ));

        mockMvc.perform(get("/api/facilities/accessibility/stats").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].province").value("Ontario"))
                .andExpect(jsonPath("$[0].accessible_percent").value(80.0))
                .andExpect(jsonPath("$[0].total_facilities").value(200))
                .andExpect(jsonPath("$[0].accessible").value(160))
                .andExpect(jsonPath("$[0].not_accessible").value(40));
    }
}