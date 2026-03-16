package ca.uoguelph.socs.cis3760.icav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FacilityScatterData {
    @JsonProperty("province")
    private String province;
    
    @JsonProperty("accessible_percent")
    private double accessiblePercent;
    
    @JsonProperty("poor_condition_percent")
    private double poorConditionPercent;
    
    @JsonProperty("total_facilities")
    private int totalFacilities;

    public FacilityScatterData() {}

    public FacilityScatterData(String province, double accessiblePercent, double poorConditionPercent, 
                               int totalFacilities) {
        this.province = province;
        this.accessiblePercent = accessiblePercent;
        this.poorConditionPercent = poorConditionPercent;
        this.totalFacilities = totalFacilities;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public double getAccessiblePercent() {
        return accessiblePercent;
    }

    public void setAccessiblePercent(double accessiblePercent) {
        this.accessiblePercent = accessiblePercent;
    }

    public double getPoorConditionPercent() {
        return poorConditionPercent;
    }

    public void setPoorConditionPercent(double poorConditionPercent) {
        this.poorConditionPercent = poorConditionPercent;
    }

    public int getTotalFacilities() {
        return totalFacilities;
    }

    public void setTotalFacilities(int totalFacilities) {
        this.totalFacilities = totalFacilities;
    }
}