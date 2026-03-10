package ca.uoguelph.socs.cis3760.icav.repository;

import ca.uoguelph.socs.cis3760.icav.model.FacilityConditionData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityConditionRepository extends JpaRepository<FacilityConditionData, Long> {
    List<FacilityConditionData> findAllByOrderByProvinceAsc();
}
