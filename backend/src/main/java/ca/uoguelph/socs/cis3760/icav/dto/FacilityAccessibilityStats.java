package ca.uoguelph.socs.cis3760.icav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FacilityAccessibilityStats {
    @JsonProperty("province")
    private String province;
    
    @JsonProperty("accessible")
    private int accessible;
    
    @JsonProperty("not_accessible")
    private int notAccessible;
    
    @JsonProperty("total_facilities")
    private int totalFacilities;
    
    @JsonProperty("accessible_percent")
    private double accessiblePercent;

    public FacilityAccessibilityStats() {}

    public FacilityAccessibilityStats(String province, int accessible, int notAccessible,
                                       int totalFacilities, double accessiblePercent) {
        this.province = province;
        this.accessible = accessible;
        this.notAccessible = notAccessible;
        this.totalFacilities = totalFacilities;
        this.accessiblePercent = accessiblePercent;
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

    public int getTotalFacilities() {
        return totalFacilities;
    }

    public void setTotalFacilities(int totalFacilities) {
        this.totalFacilities = totalFacilities;
    }

    public double getAccessiblePercent() {
        return accessiblePercent;
    }

    public void setAccessiblePercent(double accessiblePercent) {
        this.accessiblePercent = accessiblePercent;
    }
}