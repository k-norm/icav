package ca.uoguelph.socs.cis3760.icav.controller;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityAccessibilityStats;
import ca.uoguelph.socs.cis3760.icav.service.FacilityAccessibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityAccessibilityController {

    @Autowired
    private FacilityAccessibilityService facilityAccessibilityService;

    /**
     * GET endpoint to retrieve facility accessibility data by province.
     * Returns a list of FacilityAccessibilityData objects with accessibility counts
     * (Accessible, Not Accessible) for each province/territory.
     *
     * @return List of facility accessibility data grouped by province
     */
    @GetMapping("/accessibility")
    public ResponseEntity<List<FacilityAccessibilityData>> getFacilityAccessibility() {
       final List<FacilityAccessibilityData> data = facilityAccessibilityService.getFacilityAccessibilityByProvince();
        return ResponseEntity.ok(data);
    }

    /**
     * GET endpoint to retrieve facility accessibility statistics with percentages.
     * Returns a list of FacilityAccessibilityStats objects including calculated percentages
     * for accessible facilities per province.
     *
     * @return List of facility accessibility statistics with percentage calculations
     */
    @GetMapping("/accessibility/stats")
    public ResponseEntity<List<FacilityAccessibilityStats>> getFacilityAccessibilityStats() {
        final List<FacilityAccessibilityStats> stats = facilityAccessibilityService.getFacilityAccessibilityStats();
        return ResponseEntity.ok(stats);
    }
}