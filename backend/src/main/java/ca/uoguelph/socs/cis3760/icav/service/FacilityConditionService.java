package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FacilityConditionService {

    /**
     * Returns sample facility condition data by province.
     * This data is currently hardcoded but will be replaced with
     * actual Statistics Canada data in future sprints.
     */
    public List<FacilityConditionData> getFacilityConditionByProvince() {
        List<FacilityConditionData> data = new ArrayList<>();
        
        // Sample data representing facility condition counts by province
        data.add(new FacilityConditionData("Ontario", 120, 85, 45, 20));
        data.add(new FacilityConditionData("British Columbia", 95, 70, 35, 15));
        data.add(new FacilityConditionData("Alberta", 105, 75, 40, 18));
        data.add(new FacilityConditionData("Quebec", 130, 90, 50, 25));
        data.add(new FacilityConditionData("Manitoba", 60, 45, 20, 10));
        data.add(new FacilityConditionData("Saskatchewan", 55, 40, 18, 9));
        data.add(new FacilityConditionData("Nova Scotia", 40, 30, 15, 7));
        data.add(new FacilityConditionData("New Brunswick", 35, 25, 12, 6));
        data.add(new FacilityConditionData("Newfoundland", 30, 22, 10, 5));
        data.add(new FacilityConditionData("Prince Edward Island", 20, 15, 8, 3));
        
        return data;
    }
}