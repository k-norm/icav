package ca.uoguelph.socs.cis3760.icav.service;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;
import ca.uoguelph.socs.cis3760.icav.dto.FacilityAccessibilityStats;
import ca.uoguelph.socs.cis3760.icav.repository.FacilityAccessibilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacilityAccessibilityService {

    @Autowired
    private FacilityAccessibilityRepository facilityAccessibilityRepository;

    /**
     * Retrieves facility accessibility data by province from the database.
     * Returns facility accessibility counts (Accessible, Not Accessible) for each province.
     *
     * @return List of FacilityAccessibilityData objects from the database, ordered by province
     */
    public List<FacilityAccessibilityData> getFacilityAccessibilityByProvince() {
        return facilityAccessibilityRepository.findAllByOrderByProvinceAsc();
    }

    /**
     * Calculates facility accessibility statistics with percentages.
     * Computes the percentage of accessible facilities.
     *
     * @return List of FacilityAccessibilityStats with percentage calculations
     */
    public List<FacilityAccessibilityStats> getFacilityAccessibilityStats() {
        return facilityAccessibilityRepository.findAllByOrderByProvinceAsc().stream()
            .map(data -> {
                int total = data.getAccessible() + data.getNotAccessible();
                double accessiblePercent = (double) data.getAccessible() / total * 100;

                return new FacilityAccessibilityStats(
                    data.getProvince(),
                    data.getAccessible(),
                    data.getNotAccessible(),
                    total,
                    Math.round(accessiblePercent * 100.0) / 100.0
                );
            })
            .collect(Collectors.toList());
    }
}