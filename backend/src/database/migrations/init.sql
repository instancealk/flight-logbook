-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Simplified users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    aircraft_type VARCHAR(100) NOT NULL,
    flight_hours DECIMAL(5, 2) NOT NULL CHECK (flight_hours > 0),
    is_night BOOLEAN DEFAULT FALSE,
    is_solo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flight totals - (cached aggregations)
CREATE TABLE IF NOT EXISTS flight_totals (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_hours DECIMAL(10, 2) DEFAULT 0,
    day_hours DECIMAL(10, 2) DEFAULT 0,
    night_hours DECIMAL(10, 2) DEFAULT 0,
    solo_hours DECIMAL(10, 2) DEFAULT 0,
    total_flights INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flights_user_id ON flights(user_id);
CREATE INDEX IF NOT EXISTS idx_flights_date ON flights(date);

-- Insert demo user
INSERT INTO users (id, email, name) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'pilot@example.com', 'Demo Pilot')
ON CONFLICT (email) DO NOTHING;

-- Initialize flight_totals for demo user
INSERT INTO flight_totals (user_id)
VALUES ('550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (user_id) DO NOTHING;
