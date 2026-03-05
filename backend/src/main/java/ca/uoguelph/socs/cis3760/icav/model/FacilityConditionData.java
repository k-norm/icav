package ca.uoguelph.socs.cis3760.icav.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "facility_condition_data")
public class FacilityConditionData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "province")
    @JsonProperty("province")
    private String province;
    
    @Column(name = "excellent")
    @JsonProperty("excellent")
    private int excellent;
    
    @Column(name = "good")
    @JsonProperty("good")
    private int good;
    
    @Column(name = "fair")
    @JsonProperty("fair")
    private int fair;
    
    @Column(name = "poor")
    @JsonProperty("poor")
    private int poor;

    public FacilityConditionData() {}

    public FacilityConditionData(String province, int excellent, int good, int fair, int poor) {
        this.province = province;
        this.excellent = excellent;
        this.good = good;
        this.fair = fair;
        this.poor = poor;
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
}