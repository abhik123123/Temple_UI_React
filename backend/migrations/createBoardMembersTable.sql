-- Create board_members table
CREATE TABLE IF NOT EXISTS board_members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    biography TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on department for faster filtering
CREATE INDEX IF NOT EXISTS idx_board_members_department ON board_members(department);

-- Create index on email for uniqueness check
CREATE INDEX IF NOT EXISTS idx_board_members_email ON board_members(email);

-- Insert sample data
INSERT INTO board_members (full_name, position, department, email, phone_number, biography, profile_image_url) 
VALUES 
    ('Rajesh Kumar', 'President', 'Leadership', 'rajesh.kumar@temple.com', '9876543210', 
     'Rajesh Kumar has been serving as the President of our temple board for the past 10 years. With over 20 years of experience in community service and temple management, he has been instrumental in organizing various cultural and religious events.',
     '/images/placeholder.svg'),
    
    ('Priya Sharma', 'Vice President', 'Leadership', 'priya.sharma@temple.com', '9876543211',
     'Priya Sharma is our Vice President with expertise in financial management and administration. She oversees the temple operations and ensures smooth functioning of all activities.',
     '/images/placeholder.svg'),
    
    ('Amit Patel', 'Treasurer', 'Finance', 'amit.patel@temple.com', '9876543212',
     'Amit Patel manages the temple finances with great diligence. With a background in accounting and 15 years of experience, he ensures transparent financial operations.',
     '/images/placeholder.svg'),
    
    ('Lakshmi Reddy', 'Secretary', 'Administration', 'lakshmi.reddy@temple.com', '9876543213',
     'Lakshmi Reddy serves as the Secretary and maintains all temple records and documentation. She is responsible for coordinating meetings and communications.',
     '/images/placeholder.svg'),
    
    ('Venkat Rao', 'Cultural Head', 'Cultural Affairs', 'venkat.rao@temple.com', '9876543214',
     'Venkat Rao leads our cultural initiatives and festival celebrations. With deep knowledge of traditions and rituals, he ensures authentic religious observances.',
     '/images/placeholder.svg'),
    
    ('Sunita Krishnan', 'Youth Coordinator', 'Youth Services', 'sunita.krishnan@temple.com', '9876543215',
     'Sunita Krishnan manages youth programs and educational initiatives. She organizes workshops, classes, and activities for children and young adults.',
     '/images/placeholder.svg')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE board_members IS 'Temple board members information';
COMMENT ON COLUMN board_members.full_name IS 'Full name of the board member';
COMMENT ON COLUMN board_members.position IS 'Position/title in the board';
COMMENT ON COLUMN board_members.department IS 'Department or area of responsibility';
COMMENT ON COLUMN board_members.email IS 'Contact email address';
COMMENT ON COLUMN board_members.phone_number IS 'Contact phone number';
COMMENT ON COLUMN board_members.biography IS 'Brief biography of the board member';
COMMENT ON COLUMN board_members.profile_image_url IS 'URL or path to profile image';
