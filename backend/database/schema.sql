-- Temple Management Database Schema
-- PostgreSQL Database

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
DROP TABLE IF EXISTS youtube_links CASCADE;
DROP TABLE IF EXISTS gallery_videos CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS daily_prayers CASCADE;
DROP TABLE IF EXISTS priests CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS timings CASCADE;
DROP TABLE IF EXISTS board_members CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    image_url TEXT, -- S3 URL or local path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- 3. Services Table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    duration VARCHAR(50),
    category VARCHAR(50),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Staff Table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    experience INTEGER, -- years
    description TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Board Members Table
CREATE TABLE board_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    bio TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0, -- for custom ordering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Timings Table
CREATE TABLE timings (
    id SERIAL PRIMARY KEY,
    day_of_week VARCHAR(20) NOT NULL, -- Monday, Tuesday, etc.
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Donors Table
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    donation_date DATE NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Priests Table
CREATE TABLE priests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience_years INTEGER,
    languages TEXT, -- Comma-separated or JSON array
    contact VARCHAR(100),
    bio TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Gallery Images Table
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50),
    file_size INTEGER, -- in bytes
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(id)
);

-- 10. Gallery Videos Table
CREATE TABLE gallery_videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INTEGER REFERENCES users(id)
);

-- 11. YouTube Links Table
CREATE TABLE youtube_links (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by INTEGER REFERENCES users(id)
);

-- 12. Newsletter Subscriptions Table
CREATE TABLE newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'unsubscribed'
    unsubscribe_token UUID DEFAULT uuid_generate_v4()
);

-- 13. Daily Prayers Table
CREATE TABLE daily_prayers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    time TIME NOT NULL,
    description TEXT,
    language VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Event Registrations Table
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered' -- 'registered', 'cancelled'
);

-- Indexes for better query performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_timings_day ON timings(day_of_week);
CREATE INDEX idx_donors_date ON donors(donation_date);
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_members_updated_at BEFORE UPDATE ON board_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timings_updated_at BEFORE UPDATE ON timings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_priests_updated_at BEFORE UPDATE ON priests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_prayers_updated_at BEFORE UPDATE ON daily_prayers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123 - bcrypt hash)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@temple.com', '$2a$10$XQJ5YqEHvZqYqvqvqvqvqe8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q', 'admin');

COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON TABLE events IS 'Temple events and celebrations';
COMMENT ON TABLE services IS 'Spiritual services offered';
COMMENT ON TABLE staff IS 'Temple staff information';
COMMENT ON TABLE board_members IS 'Temple board members';
COMMENT ON TABLE timings IS 'Temple operating hours';
COMMENT ON TABLE donors IS 'Donation records';
COMMENT ON TABLE priests IS 'Temple priests information';
COMMENT ON TABLE gallery_images IS 'Gallery image uploads';
COMMENT ON TABLE gallery_videos IS 'Gallery video uploads';
COMMENT ON TABLE youtube_links IS 'YouTube video links';
COMMENT ON TABLE newsletter_subscriptions IS 'Newsletter subscriber list';
COMMENT ON TABLE daily_prayers IS 'Daily prayer schedule';
COMMENT ON TABLE event_registrations IS 'Event registration records';
