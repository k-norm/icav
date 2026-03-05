package ca.uoguelph.socs.cis3760.icav.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FacilityConditionStats {
    @JsonProperty("province")
    private String province;
    
    @JsonProperty("excellent")
    private int excellent;
    
    @JsonProperty("good")
    private int good;
    
    @JsonProperty("fair")
    private int fair;
    
    @JsonProperty("poor")
    private int poor;
    
    @JsonProperty("total_facilities")
    private int totalFacilities;
    
    @JsonProperty("excellent_percent")
    private double excellentPercent;
    
    @JsonProperty("good_percent")
    private double goodPercent;
    
    @JsonProperty("fair_percent")
    private double fairPercent;
    
    @JsonProperty("poor_percent")
    private double poorPercent;

    public FacilityConditionStats() {}

    public FacilityConditionStats(String province, int excellent, int good, int fair, int poor,
                                   int totalFacilities, double excellentPercent, double goodPercent,
                                   double fairPercent, double poorPercent) {
        this.province = province;
        this.excellent = excellent;
        this.good = good;
        this.fair = fair;
        this.poor = poor;
        this.totalFacilities = totalFacilities;
        this.excellentPercent = excellentPercent;
        this.goodPercent = goodPercent;
        this.fairPercent = fairPercent;
        this.poorPercent = poorPercent;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public int getExcellent() {
        return excellent;
    }

    public void setExcellent(int excellent) {
        this.excellent = excellent;
    }

    public int getGood() {
        return good;
    }

    public void setGood(int good) {
        this.good = good;
    }

    public int getFair() {
        return fair;
    }

    public void setFair(int fair) {
        this.fair = fair;
    }

    public int getPoor() {
        return poor;
    }

    public void setPoor(int poor) {
        this.poor = poor;
    }

    public int getTotalFacilities() {
        return totalFacilities;
    }

    public void setTotalFacilities(int totalFacilities) {
        this.totalFacilities = totalFacilities;
    }

    public double getExcellentPercent() {
        return excellentPercent;
    }

    public void setExcellentPercent(double excellentPercent) {
        this.excellentPercent = excellentPercent;
    }

    public double getGoodPercent() {
        return goodPercent;
    }

    public void setGoodPercent(double goodPercent) {
        this.goodPercent = goodPercent;
    }

    public double getFairPercent() {
        return fairPercent;
    }

    public void setFairPercent(double fairPercent) {
        this.fairPercent = fairPercent;
    }

    public double getPoorPercent() {
        return poorPercent;
    }

    public void setPoorPercent(double poorPercent) {
        this.poorPercent = poorPercent;
    }
}
