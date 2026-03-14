-- ICAV Database Initialization Script
-- This script runs when MariaDB container first starts

CREATE DATABASE IF NOT EXISTS icavdb;
USE icavdb;

-- Placeholder table for Sprint 4
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES ('Admin User', 'admin@icav.local');

-- Facility Condition Data Table
CREATE TABLE IF NOT EXISTS facility_condition_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    province VARCHAR(100) NOT NULL,
    excellent INT DEFAULT 0,
    good INT DEFAULT 0,
    fair INT DEFAULT 0,
    poor INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert facility condition data for Canadian provinces
INSERT INTO facility_condition_data (province, excellent, good, fair, poor) VALUES
('Ontario', 850, 720, 480, 150),
('Quebec', 780, 650, 520, 180),
('British Columbia', 920, 680, 390, 110),
('Alberta', 890, 710, 450, 120),
('Manitoba', 720, 580, 390, 110),
('Saskatchewan', 650, 520, 380, 100),
('Nova Scotia', 580, 470, 320, 130),
('New Brunswick', 520, 410, 280, 90),
('Prince Edward Island', 450, 380, 220, 50),
('Newfoundland and Labrador', 620, 510, 350, 120);

-- Facility Accessibility Data Table
CREATE TABLE IF NOT EXISTS facility_accessibility_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    province VARCHAR(100) NOT NULL,
    accessible INT DEFAULT 0,
    not_accessible INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert facility accessibility data for Canadian provinces (simulated data)
INSERT INTO facility_accessibility_data (province, accessible, not_accessible) VALUES
('Ontario', 1800, 400),
('Quebec', 1700, 430),
('British Columbia', 1900, 200),
('Alberta', 1850, 320),
('Manitoba', 1600, 200),
('Saskatchewan', 1500, 150),
('Nova Scotia', 1300, 200),
('New Brunswick', 1200, 100),
('Prince Edward Island', 1000, 100),
('Newfoundland and Labrador', 1400, 200);

-- Create view for facility condition statistics
CREATE VIEW facility_condition_stats AS
SELECT 
    province,
    excellent,
    good,
    fair,
    poor,
    (excellent + good + fair + poor) as total_facilities,
    ROUND((excellent / (excellent + good + fair + poor)) * 100, 2) as excellent_percent,
    ROUND((good / (excellent + good + fair + poor)) * 100, 2) as good_percent,
    ROUND((fair / (excellent + good + fair + poor)) * 100, 2) as fair_percent,
    ROUND((poor / (excellent + good + fair + poor)) * 100, 2) as poor_percent
FROM facility_condition_data
ORDER BY province;

-- Create view for facility accessibility statistics
CREATE VIEW facility_accessibility_stats AS
SELECT 
    province,
    accessible,
    not_accessible,
    (accessible + not_accessible) as total_facilities,
    ROUND((accessible / (accessible + not_accessible)) * 100, 2) as accessible_percent
FROM facility_accessibility_data
ORDER BY province;

-- Placeholder for future feature tables
-- More tables will be added as epics and user stories are implemented

GRANT ALL PRIVILEGES ON icavdb.* TO 'icav'@'%';
FLUSH PRIVILEGES;
