package ca.uoguelph.socs.cis3760.icav.repository;

import ca.uoguelph.socs.cis3760.icav.model.FacilityAccessibilityData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityAccessibilityRepository extends JpaRepository<FacilityAccessibilityData, Long> {
    List<FacilityAccessibilityData> findAllByOrderByProvinceAsc();
}