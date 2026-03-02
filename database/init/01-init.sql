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

-- Placeholder for future feature tables
-- More tables will be added as epics and user stories are implemented

GRANT ALL PRIVILEGES ON icavdb.* TO 'icav'@'%';
FLUSH PRIVILEGES;
