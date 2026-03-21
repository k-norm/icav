package ca.uoguelph.socs.cis3760.icav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FacilityHeatmapData {
    @JsonProperty("province")
    private String province;

    @JsonProperty("excellent_percent")
    private double excellentPercent;

    @JsonProperty("poor_percent")
    private double poorPercent;

    @JsonProperty("total_facilities")
    private int totalFacilities;

    public FacilityHeatmapData() {
    }

    public FacilityHeatmapData(String province, double excellentPercent, double poorPercent, int totalFacilities) {
        this.province = province;
        this.excellentPercent = excellentPercent;
        this.poorPercent = poorPercent;
        this.totalFacilities = totalFacilities;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public double getExcellentPercent() {
        return excellentPercent;
    }

    public void setExcellentPercent(double excellentPercent) {
        this.excellentPercent = excellentPercent;
    }

    public double getPoorPercent() {
        return poorPercent;
    }

    public void setPoorPercent(double poorPercent) {
        this.poorPercent = poorPercent;
    }

    public int getTotalFacilities() {
        return totalFacilities;
    }

    public void setTotalFacilities(int totalFacilities) {
        this.totalFacilities = totalFacilities;
    }
}
