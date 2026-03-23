-- Test data for FacilityConditionData
INSERT INTO facility_condition_data (province, excellent, good, fair, poor) VALUES
('Ontario', 100, 50, 30, 20),
('Quebec', 80, 40, 25, 15),
('British Columbia', 60, 35, 20, 10),
('Alberta', 70, 45, 15, 5);

-- Test data for FacilityAccessibilityData
INSERT INTO facility_accessibility_data (province, accessible, not_accessible) VALUES
('Ontario', 180, 40),
('Quebec', 160, 20),
('British Columbia', 120, 25),
('Alberta', 140, 15);