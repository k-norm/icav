package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class FacilityConditionServiceTest {

    private FacilityConditionService facilityConditionService;

    @BeforeEach
    public void setUp() {
        facilityConditionService = new FacilityConditionService();
    }

    @Test
    public void testGetFacilityConditionByProvince_ReturnsData() {
        List<FacilityConditionData> data = facilityConditionService.getFacilityConditionByProvince();
        
        assertNotNull(data);
        assertFalse(data.isEmpty());
        assertEquals(10, data.size());
    }

    @Test
    public void testGetFacilityConditionByProvince_DataContainsOntario() {
        List<FacilityConditionData> data = facilityConditionService.getFacilityConditionByProvince();
        
        boolean ontarioFound = data.stream()
            .anyMatch(d -> "Ontario".equals(d.getProvince()));
        
        assertTrue(ontarioFound);
    }

    @Test
    public void testFacilityConditionDataModel() {
        FacilityConditionData data = new FacilityConditionData("Test Province", 100, 80, 50, 20);
        
        assertEquals("Test Province", data.getProvince());
        assertEquals(100, data.getExcellent());
        assertEquals(80, data.getGood());
        assertEquals(50, data.getFair());
        assertEquals(20, data.getPoor());
    }
}
