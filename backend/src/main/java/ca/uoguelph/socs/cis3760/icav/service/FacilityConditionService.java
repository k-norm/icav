package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityHeatmapData;
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
                final int total = calculateConditionTotal(data);
                return new FacilityConditionStats(
                    data.getProvince(),
                    data.getExcellent(),
                    data.getGood(),
                    data.getFair(),
                    data.getPoor(),
                    total,
                    calculatePercent(total, data.getExcellent()),
                    calculatePercent(total, data.getGood()),
                    calculatePercent(total, data.getFair()),
                    calculatePercent(total, data.getPoor())
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
        final List<FacilityConditionData> conditionData = facilityConditionRepository.findAllByOrderByProvinceAsc();
        final List<ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData> accessibilityData = 
            facilityAccessibilityRepository.findAllByOrderByProvinceAsc();

        // Create maps for easy lookup
        final Map<String, FacilityConditionData> conditionMap = conditionData.stream()
            .collect(Collectors.toMap(FacilityConditionData::getProvince, data -> data));

        final Map<String, ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData> accessibilityMap = 
            accessibilityData.stream().collect(Collectors.toMap(
                        ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData::getProvince, data -> data));

        return conditionMap.keySet().stream()
            .filter(province -> accessibilityMap.containsKey(province))
            .map(province -> {
                final FacilityConditionData cond = conditionMap.get(province);
                final ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData acc = accessibilityMap
                        .get(province);

                final int totalCondition = calculateConditionTotal(cond);
                final int totalAccessibility = acc.getAccessible() + acc.getNotAccessible();

                return new FacilityScatterData(
                    province,
                    calculatePercent(totalAccessibility, acc.getAccessible()),
                    calculatePercent(totalCondition, cond.getPoor()),
                    totalCondition  // Using condition total as total facilities
                );
            })
            .collect(Collectors.toList());
    }

    /**
     * Retrieves heatmap data for facility conditions by province.
     * Contains excellent and poor percentages to drive color intensity.
     *
     * @return List of FacilityHeatmapData for provinces
     */
    public List<FacilityHeatmapData> getFacilityHeatmapData() {
        return facilityConditionRepository.findAllByOrderByProvinceAsc().stream()
            .map(data -> {
                final int total = calculateConditionTotal(data);

                return new FacilityHeatmapData(
                    data.getProvince(),
                    calculatePercent(total, data.getExcellent()),
                    calculatePercent(total, data.getPoor()),
                    total
                );
            })
            .collect(Collectors.toList());
    }


    /**
    * Calculate the total facilities given a FacilityConditionData object
    * 
    * @return total number of facilities
    */
    private int calculateConditionTotal (FacilityConditionData data){
        return data.getExcellent() + data.getGood() + data.getFair() + data.getPoor();
    }


    /**
     * Calculates the percentage that a given portion represents of a total,
     * rounded to two decimal places. If total is zero or less return 0.0 to 
     * avoid division by zero or negatice percentage.
     * 
     * @return percentage value of portion over total
     */
    private double calculatePercent(int total, int portion){
        // extra multiplication/division for rounding to correct place
        return total > 0 ? Math.round((double) portion / total * 10000.0) / 100.0 : 0.0;
    }
}