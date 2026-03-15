package ca.uoguelph.socs.cis3760.icav.controller;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityScatterData;
import ca.uoguelph.socs.cis3760.icav.service.FacilityConditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*")
public class FacilityConditionController {

    @Autowired
    private FacilityConditionService facilityConditionService;

    /**
     * GET endpoint to retrieve facility condition data by province.
     * Returns a list of FacilityConditionData objects with condition counts
     * (Excellent, Good, Fair, Poor) for each province/territory.
     *
     * @return List of facility condition data grouped by province
     */
    @GetMapping("/condition")
    public ResponseEntity<List<FacilityConditionData>> getFacilityCondition() {
        List<FacilityConditionData> data = facilityConditionService.getFacilityConditionByProvince();
        return ResponseEntity.ok(data);
    }

    /**
     * GET endpoint to retrieve facility condition statistics with percentages.
     * Returns a list of FacilityConditionStats objects including calculated percentages
     * for each condition category (Excellent, Good, Fair, Poor) per province.
     *
     * @return List of facility condition statistics with percentage calculations
     */
    @GetMapping("/stats")
    public ResponseEntity<List<FacilityConditionStats>> getFacilityConditionStats() {
        List<FacilityConditionStats> stats = facilityConditionService.getFacilityConditionStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET endpoint to retrieve facility scatter plot data.
     * Returns combined data for accessibility % vs poor condition % with total facilities.
     *
     * @return List of facility scatter data for provinces
     */
    @GetMapping("/scatter")
    public ResponseEntity<List<FacilityScatterData>> getFacilityScatterData() {
        List<FacilityScatterData> data = facilityConditionService.getFacilityScatterData();
        return ResponseEntity.ok(data);
    }
}