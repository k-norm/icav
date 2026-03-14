package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityScatterData;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityConditionRepository;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityAccessibilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FacilityConditionService {

    @Autowired
    private FacilityConditionRepository facilityConditionRepository;

    @Autowired
    private FacilityAccessibilityRepository facilityAccessibilityRepository;

    /**
     * Retrieves facility condition data by province from the database.
     * Returns facility condition counts (Excellent, Good, Fair, Poor) for each province.
     *
     * @return List of FacilityConditionData objects from the database, ordered by province
     */
    public List<FacilityConditionData> getFacilityConditionByProvince() {
        return facilityConditionRepository.findAllByOrderByProvinceAsc();
    }

    /**
     * Calculates facility condition statistics with percentages.
     * Computes the percentage distribution of Excellent, Good, Fair, and Poor facilities.
     *
     * @return List of FacilityConditionStats with percentage calculations
     */
    public List<FacilityConditionStats> getFacilityConditionStats() {
        return facilityConditionRepository.findAllByOrderByProvinceAsc().stream()
            .map(data -> {
                int total = data.getExcellent() + data.getGood() + data.getFair() + data.getPoor();
                double excellentPercent = (double) data.getExcellent() / total * 100;
                double goodPercent = (double) data.getGood() / total * 100;
                double fairPercent = (double) data.getFair() / total * 100;
                double poorPercent = (double) data.getPoor() / total * 100;

                return new FacilityConditionStats(
                    data.getProvince(),
                    data.getExcellent(),
                    data.getGood(),
                    data.getFair(),
                    data.getPoor(),
                    total,
                    Math.round(excellentPercent * 100.0) / 100.0,
                    Math.round(goodPercent * 100.0) / 100.0,
                    Math.round(fairPercent * 100.0) / 100.0,
                    Math.round(poorPercent * 100.0) / 100.0
                );
            })
            .collect(Collectors.toList());
    }

    /**
     * Calculates facility scatter plot data combining accessibility and condition.
     * Returns data for provinces with accessible %, poor condition %, and total facilities.
     *
     * @return List of FacilityScatterData for scatter plot
     */
    public List<FacilityScatterData> getFacilityScatterData() {
        List<FacilityConditionData> conditionData = facilityConditionRepository.findAllByOrderByProvinceAsc();
        List<ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData> accessibilityData = facilityAccessibilityRepository.findAllByOrderByProvinceAsc();

        // Create maps for easy lookup
        Map<String, FacilityConditionData> conditionMap = conditionData.stream()
            .collect(Collectors.toMap(FacilityConditionData::getProvince, data -> data));

        Map<String, ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData> accessibilityMap = accessibilityData.stream()
            .collect(Collectors.toMap(ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData::getProvince, data -> data));

        return conditionMap.keySet().stream()
            .filter(province -> accessibilityMap.containsKey(province))
            .map(province -> {
                FacilityConditionData cond = conditionMap.get(province);
                ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData acc = accessibilityMap.get(province);

                int totalCondition = cond.getExcellent() + cond.getGood() + cond.getFair() + cond.getPoor();
                double poorPercent = (double) cond.getPoor() / totalCondition * 100;

                int totalAccessibility = acc.getAccessible() + acc.getNotAccessible();
                double accessiblePercent = (double) acc.getAccessible() / totalAccessibility * 100;

                return new FacilityScatterData(
                    province,
                    Math.round(accessiblePercent * 100.0) / 100.0,
                    Math.round(poorPercent * 100.0) / 100.0,
                    totalCondition  // Using condition total as total facilities
                );
            })
            .collect(Collectors.toList());
    }
}