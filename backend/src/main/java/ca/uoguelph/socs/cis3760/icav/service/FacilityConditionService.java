package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityConditionStats;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityConditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityConditionService {

    @Autowired
    private FacilityConditionRepository facilityConditionRepository;

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
}