-- ============================================================
-- Temple DB - Complete Schema Migration
-- ============================================================

-- EVENTS
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    category VARCHAR(100) DEFAULT 'General',
    status VARCHAR(50) DEFAULT 'Upcoming',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price VARCHAR(100) DEFAULT 'Free',
    icon VARCHAR(50) DEFAULT '🙏',
    details JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STAFF
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    phone_number VARCHAR(50),
    email VARCHAR(255),
    joining_date DATE,
    responsibilities TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOARD MEMBERS
CREATE TABLE IF NOT EXISTS board_members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    biography TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TIMINGS (one row per day)
CREATE TABLE IF NOT EXISTS timings (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20) NOT NULL UNIQUE,
    notes VARCHAR(255) DEFAULT ''
);

-- TIMING SLOTS (multiple slots per day)
CREATE TABLE IF NOT EXISTS timing_slots (
    id SERIAL PRIMARY KEY,
    timing_id INTEGER NOT NULL REFERENCES timings(id) ON DELETE CASCADE,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL
);

-- GALLERY
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) DEFAULT '',
    description TEXT DEFAULT '',
    url TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'image',  -- 'image', 'video', 'youtube'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_board_department ON board_members(department);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery(type);
CREATE INDEX IF NOT EXISTS idx_timing_slots_timing_id ON timing_slots(timing_id);

-- ============================================================
-- SAMPLE DATA - Events
-- ============================================================
INSERT INTO events (title, description, event_date, start_time, end_time, location, category, status) VALUES
('Diwali Celebration', 'Join us for a spectacular Diwali celebration with traditional rituals, prayers, and community gathering.', '2026-11-15', '18:00', '22:00', 'Temple Main Hall', 'Festival', 'Upcoming'),
('Lord Shiva Puja', 'Special prayer ceremony dedicated to Lord Shiva with Abhishekam and Archana.', '2026-12-01', '06:00', '08:00', 'Inner Sanctum', 'Religious', 'Upcoming'),
('Navratri Festival', 'Nine nights of devotion, music, and dance dedicated to Goddess Durga.', '2026-10-02', '19:00', '23:00', 'Temple Grounds', 'Festival', 'Upcoming'),
('Annual Temple Anniversary', 'Celebrating the founding of our temple with special prayers and cultural programs.', '2026-09-10', '08:00', '20:00', 'Main Temple Complex', 'Anniversary', 'Upcoming')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA - Services
-- ============================================================
INSERT INTO services (name, description, price, icon, details) VALUES
('Daily Pujas', 'Participate in our daily morning and evening prayer services.', 'Free', '🙏', '["Morning Prayers at 5:00 AM", "Evening Prayers at 7:00 PM", "Guided meditation"]'),
('Special Prayers', 'Customized prayer ceremonies for special occasions and personal intentions.', '₹500 - ₹2000', '✨', '["Family blessings", "Health & wellness prayers", "Success rituals"]'),
('Spiritual Counseling', 'One-on-one guidance from our experienced spiritual advisors.', '₹1000/session', '📖', '["Personal consultation", "Life guidance", "Spiritual development"]'),
('Bajanas (Bhajans)', 'Join our devotional singing sessions and spiritual music gatherings.', 'Free', '🎵', '["Daily bhajan sessions", "Festival special performances", "Community participation welcome"]'),
('Yoga & Meditation', 'Regular classes for physical and mental wellness.', '₹2000/month', '🧘', '["Morning yoga classes", "Evening meditation", "Breathing techniques"]'),
('Temple Tours', 'Guided tours explaining the temple history and architecture.', '₹200/person', '🏛️', '["Heritage tour", "Historical insights", "Photography allowed"]')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA - Staff
-- ============================================================
INSERT INTO staff (full_name, role, department, phone_number, email, joining_date, responsibilities) VALUES
('Ramesh Kumar', 'Temple Manager', 'Administration', '9876543210', 'ramesh.kumar@temple.com', '2015-06-15', 'Overall temple operations and daily management. Coordinates with all departments.'),
('Lakshmi Devi', 'Head Cook', 'Kitchen', '9876543211', 'lakshmi.devi@temple.com', '2018-03-20', 'Manages prasadam preparation and kitchen operations. Ensures quality and hygiene standards.'),
('Suresh Reddy', 'Maintenance Supervisor', 'Maintenance', '9876543212', 'suresh.reddy@temple.com', '2017-09-10', 'Oversees temple maintenance and repairs. Manages maintenance staff and supplies.'),
('Anjali Sharma', 'Office Coordinator', 'Administration', '9876543213', 'anjali.sharma@temple.com', '2019-01-15', 'Handles administrative tasks and office management. Manages visitor inquiries.'),
('Venkatesh Rao', 'Security Officer', 'Security', '9876543214', 'venkatesh.rao@temple.com', '2016-08-01', 'Ensures temple security and safety. Manages security staff and shift schedules.'),
('Meena Krishnan', 'Accounts Assistant', 'Finance', '9876543215', 'meena.krishnan@temple.com', '2020-02-10', 'Assists with accounting and financial record-keeping. Processes donations.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA - Board Members
-- ============================================================
INSERT INTO board_members (full_name, position, department, email, phone_number, biography) VALUES
('Rajesh Kumar', 'President', 'Leadership', 'rajesh.kumar@temple.com', '9876543210', 'Rajesh Kumar has been serving as the President for 10 years with over 20 years of community service experience.'),
('Priya Sharma', 'Vice President', 'Leadership', 'priya.sharma@temple.com', '9876543211', 'Priya Sharma is our Vice President with expertise in financial management and administration.'),
('Amit Patel', 'Treasurer', 'Finance', 'amit.patel@temple.com', '9876543212', 'Amit Patel manages the temple finances with great diligence and 15 years of accounting experience.'),
('Lakshmi Reddy', 'Secretary', 'Administration', 'lakshmi.reddy@temple.com', '9876543213', 'Lakshmi Reddy serves as the Secretary and maintains all temple records and documentation.'),
('Venkat Rao', 'Cultural Head', 'Cultural Affairs', 'venkat.rao@temple.com', '9876543214', 'Venkat Rao leads cultural initiatives and festival celebrations with deep knowledge of traditions.'),
('Sunita Krishnan', 'Youth Coordinator', 'Youth Services', 'sunita.krishnan@temple.com', '9876543215', 'Sunita Krishnan manages youth programs and educational initiatives for children and young adults.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA - Timings
-- ============================================================
INSERT INTO timings (day, notes) VALUES
('Monday',    'Regular Schedule'),
('Tuesday',   'Regular Schedule'),
('Wednesday', 'Regular Schedule'),
('Thursday',  'Regular Schedule'),
('Friday',    'Regular Schedule'),
('Saturday',  'Extended Hours'),
('Sunday',    'Weekend Schedule')
ON CONFLICT (day) DO NOTHING;

-- Timing slots (after timings are inserted)
INSERT INTO timing_slots (timing_id, open_time, close_time)
SELECT t.id, '06:00', '13:00' FROM timings t WHERE t.day IN ('Monday','Tuesday','Wednesday','Thursday','Friday')
ON CONFLICT DO NOTHING;

INSERT INTO timing_slots (timing_id, open_time, close_time)
SELECT t.id, '16:00', '21:00' FROM timings t WHERE t.day IN ('Monday','Tuesday','Wednesday','Thursday','Friday')
ON CONFLICT DO NOTHING;

INSERT INTO timing_slots (timing_id, open_time, close_time)
SELECT t.id, '06:00', '21:00' FROM timings t WHERE t.day = 'Saturday'
ON CONFLICT DO NOTHING;

INSERT INTO timing_slots (timing_id, open_time, close_time)
SELECT t.id, '07:00', '21:00' FROM timings t WHERE t.day = 'Sunday'
ON CONFLICT DO NOTHING;
