package ca.uoguelph.socs.cis3760.icav.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "facility_accessibility_data")
public class FacilityAccessibilityData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "province")
    @JsonProperty("province")
    private String province;
    
    @Column(name = "accessible")
    @JsonProperty("accessible")
    private int accessible;
    
    @Column(name = "not_accessible")
    @JsonProperty("not_accessible")
    private int notAccessible;

    public FacilityAccessibilityData() {}

    public FacilityAccessibilityData(String province, int accessible, int notAccessible) {
        this.province = province;
        this.accessible = accessible;
        this.notAccessible = notAccessible;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public int getAccessible() {
        return accessible;
    }

    public void setAccessible(int accessible) {
        this.accessible = accessible;
    }

    public int getNotAccessible() {
        return notAccessible;
    }

    public void setNotAccessible(int notAccessible) {
        this.notAccessible = notAccessible;
    }

    public int getTotal() {
        return accessible + notAccessible;
    }

    public double getAccessiblePercent() {
        int total = getTotal();
        return total == 0 ? 0 : Math.round((accessible / (double) total) * 100 * 100.0) / 100.0;
    }
}