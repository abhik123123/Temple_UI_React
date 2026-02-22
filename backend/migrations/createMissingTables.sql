-- ============================================================
-- Temple DB - Missing Tables Migration
-- bajanas, daily_poojas, pooja_books, donors
-- ============================================================

-- DONORS
CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    in_memory_of VARCHAR(255),
    donation_type VARCHAR(100) DEFAULT 'cash',
    amount NUMERIC(10,2) DEFAULT 0,
    items TEXT,
    item_description TEXT,
    item_value NUMERIC(10,2),
    donation_date DATE DEFAULT CURRENT_DATE,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BAJANAS
CREATE TABLE IF NOT EXISTS bajanas (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    category VARCHAR(100) DEFAULT 'devotional',
    deity VARCHAR(100),
    schedule VARCHAR(255),
    description TEXT,
    details JSONB DEFAULT '[]',
    icon VARCHAR(50) DEFAULT '🎵',
    has_audio BOOLEAN DEFAULT false,
    has_lyrics BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DAILY POOJAS
CREATE TABLE IF NOT EXISTS daily_poojas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    time VARCHAR(10),
    duration VARCHAR(100),
    day VARCHAR(50) DEFAULT 'Daily',
    description TEXT,
    deity VARCHAR(255),
    details JSONB DEFAULT '[]',
    icon VARCHAR(50) DEFAULT '🪔',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POOJA BOOKS
CREATE TABLE IF NOT EXISTS pooja_books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    description TEXT,
    details JSONB DEFAULT '[]',
    icon VARCHAR(50) DEFAULT '📚',
    language VARCHAR(100) DEFAULT 'Sanskrit & English',
    pages INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'beginner',
    downloadable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_donors_date      ON donors(donation_date);
CREATE INDEX IF NOT EXISTS idx_bajanas_category ON bajanas(category);
CREATE INDEX IF NOT EXISTS idx_bajanas_deity    ON bajanas(deity);
CREATE INDEX IF NOT EXISTS idx_poojas_day       ON daily_poojas(day);
CREATE INDEX IF NOT EXISTS idx_poojabooks_cat   ON pooja_books(category);

-- ============================================================
-- SEED DATA - Bajanas
-- ============================================================
INSERT INTO bajanas (title, artist, category, deity, schedule, description, details, icon, has_audio, has_lyrics) VALUES
('Shiva Bhajan',        'Temple Choir',       'devotional', 'shiva',   'Every Monday at 6:00 PM',            'Traditional devotional songs dedicated to Lord Shiva, performed during evening prayers.',           '["Sanskrit & Telugu lyrics","Duration: 30 minutes","Open to all devotees"]',                                  '🕉️', true, true),
('Krishna Bhajan',      'Devotional Group',   'devotional', 'krishna', 'Janmashtami Special',                 'Melodious bhajans celebrating Lord Krishna, his divine play and teachings.',                       '["Classical ragas","Group singing","Traditional instruments"]',                                               '🦚', true, true),
('Devi Stotram',        'Temple Priests',     'devotional', 'devi',    'Fridays at 7:30 PM',                  'Sacred hymns praising the Divine Mother in various forms.',                                        '["Sanskrit chanting","Powerful mantras","Special occasions"]',                                                '🔱', true, true),
('Ganesha Stuti',       'Temple Choir',       'devotional', 'ganesha', 'Every Wednesday at 6:30 PM',          'Auspicious prayers to Lord Ganesha, the remover of obstacles and lord of beginnings.',             '["Sanskrit mantras","Traditional melodies","Family friendly"]',                                               '🐘', true, true),
('Vishnu Sahasranamam', 'Vedic Scholars',     'devotional', 'vishnu',  'Every Thursday at 7:00 PM',           'The thousand names of Lord Vishnu, chanted for peace and prosperity.',                             '["1000 sacred names","Sanskrit chanting","Powerful mantras","Duration: 45 minutes"]',                        '🪷', true, true),
('Rama Bhajan',         'Devotional Group',   'devotional', 'rama',    'Ram Navami Special',                  'Devotional songs celebrating Lord Rama, his virtues and divine life story.',                        '["Ramayana stories","Bhakti songs","Telugu & Sanskrit","All ages welcome"]',                                   '🏹', true, true),
('Hanuman Chalisa',     'Temple Choir',       'devotional', 'hanuman', 'Every Tuesday & Saturday at 6:00 AM', 'Powerful 40-verse prayer to Lord Hanuman for strength, courage, and protection.',                  '["Hindi devotional","Morning prayers","Strength & courage","Protection mantras"]',                            '🐒', true, true),
('Lakshmi Ashtottara',  'Temple Priests',     'devotional', 'devi',    'Fridays during Diwali season',         'The 108 names of Goddess Lakshmi for prosperity and abundance.',                                   '["108 sacred names","Prosperity prayers","Sanskrit chanting","Festival special"]',                            '💰', true, true),
('Saraswati Vandana',   'Students & Teachers','devotional', 'devi',    'During Basant Panchami',              'Prayers to Goddess Saraswati for knowledge, wisdom, and learning.',                                 '["Knowledge & wisdom","Student prayers","Sanskrit verses","Educational blessings"]',                          '📚', true, true),
('Surya Namaskar Mantra','Morning Prayer Group','devotional','vishnu',  'Every Sunday at 6:30 AM',             'Sacred mantras honoring Surya, the Sun God, for health and vitality.',                              '["12 sun salutation mantras","Morning energy","Health prayers","Sanskrit chanting"]',                         '☀️', true, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA - Daily Poojas
-- ============================================================
INSERT INTO daily_poojas (name, time, duration, day, description, deity, details, icon) VALUES
('Morning Suprabhatam',   '05:00', '30 minutes',  'Daily',    'Wake up prayers to Lord Venkateswara with traditional suprabhatam hymns',               'Lord Venkateswara',  '["Suprabhatam chanting","Mangala Harathi","Fresh flower decoration","Open to all devotees"]',                   '🌅'),
('Abhishekam',            '06:00', '45 minutes',  'Daily',    'Sacred ritual bath for the deity with milk, honey, and other sacred ingredients',       'Main Deity',         '["Panchamrutham Abhishekam","Sacred mantras","Special offerings","Prasadam distribution"]',                     '🪔'),
('Sahasranama Archana',   '07:00', '60 minutes',  'Daily',    'Chanting of 1000 names of the deity with flower offerings',                             'Lord Vishnu',        '["1000 names chanting","Flower archana","Vedic hymns","Special blessings"]',                                    '🌺'),
('Ekadasi Special Pooja', '08:00', '90 minutes',  'Monday',   'Special elaborate worship on Ekadasi day with extended rituals',                        'Lord Vishnu',        '["Extended abhishekam","Special alankaram","Ekadasi fasting guidance","Community prayers"]',                    '✨'),
('Lalitha Sahasranamam',  '09:00', '45 minutes',  'Friday',   '1000 names of Goddess Lalitha, special Friday prayers for feminine divine',             'Goddess Lalitha',    '["Traditional chanting","Flower offerings","Kumkum archana","Blessings for families"]',                        '🌸'),
('Rudrabhishekam',        '07:30', '60 minutes',  'Monday',   'Special abhishekam to Lord Shiva with Rudram chanting on auspicious Mondays',           'Lord Shiva',         '["Rudram chanting","Bilva leaves offering","Milk abhishekam","Vibhuti prasadam"]',                              '🔱'),
('Noon Pooja',            '12:00', '30 minutes',  'Daily',    'Midday prayers and food offerings to the deity',                                        'Main Deity',         '["Naivedyam offering","Noon archana","Quick darshan","Prasadam available"]',                                    '☀️'),
('Satyanarayana Vratham', '10:00', '120 minutes', 'Thursday', 'Auspicious Satyanarayana pooja performed every Thursday for prosperity',                 'Lord Satyanarayana', '["Complete vratham","Story narration","Prasadam distribution","Family participation welcome"]',                 '🙏'),
('Hanuman Chalisa',       '07:00', '30 minutes',  'Tuesday',  'Special prayers to Lord Hanuman with Chalisa chanting every Tuesday',                   'Lord Hanuman',       '["Chalisa chanting","Sindoor offering","Special archana","Strength & courage blessings"]',                      '💪'),
('Lakshmi Pooja',         '11:00', '45 minutes',  'Friday',   'Worship of Goddess Lakshmi for wealth, prosperity and abundance',                       'Goddess Lakshmi',    '["Lakshmi ashtothram","Coin offerings","Turmeric kumkum","Prosperity blessings"]',                              '💰'),
('Evening Deeparadhana',  '18:00', '30 minutes',  'Daily',    'Beautiful evening lamp ceremony with traditional songs and prayers',                     'All Deities',        '["Lamp lighting ceremony","Evening hymns","Camphor harathi","Community participation"]',                         '🪔'),
('Vishnu Sahasranamam',   '19:00', '45 minutes',  'Saturday', '1000 names of Lord Vishnu chanted on Saturday evenings',                                'Lord Vishnu',        '["Sahasranamam chanting","Tulsi archana","Sacred hymns","Divine blessings"]',                                  '🦅'),
('Night Pooja & Closing', '20:30', '30 minutes',  'Daily',    'Final prayers of the day before temple closing with peaceful mantras',                   'All Deities',        '["Closing prayers","Night mantras","Deity rest ceremony","Final harathi"]',                                    '🌙')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA - Pooja Books
-- ============================================================
INSERT INTO pooja_books (title, category, description, details, icon, language, pages, level, downloadable) VALUES
('Shiva Puja Vidhanam',   'shiva',   'Complete guide to performing Shiva worship with mantras, rituals, and offerings.',                           '["Rudrabhishekam procedure","Bilva patra significance","Maha Mrityunjaya Mantra","Monday fasting guidelines","Pradosha puja method"]',          '🕉️', 'Sanskrit & English',        45,  'intermediate', true),
('Ganesha Puja Guide',    'ganesha', 'Step-by-step instructions for Ganesha worship for removing obstacles and new beginnings.',                   '["Ganapati Atharvashirsha","Modak offering tradition","Chaturthi puja significance","Ganesha mantras & stotras","Daily worship procedure"]',    '🐘', 'Sanskrit & English',        32,  'beginner',     true),
('Lakshmi Puja Paddhati', 'devi',    'Traditional methods of Goddess Lakshmi worship for prosperity and abundance.',                               '["Friday Lakshmi puja","Diwali Lakshmi puja complete","Mahalakshmi Ashtakam","Offering procedures","Wealth mantras"]',                           '💰', 'Sanskrit & Telugu',         38,  'intermediate', true),
('Saraswati Vandana',     'devi',    'Worship guide for Goddess Saraswati for knowledge, wisdom, and learning success.',                           '["Basant Panchami puja","Student prayer mantras","Saraswati Stotram","Book worship tradition","Vidya puja procedure"]',                         '📚', 'Sanskrit & Hindi',          28,  'beginner',     true),
('Vishnu Sahasranamam',   'vishnu',  'The thousand names of Lord Vishnu with meanings and chanting guide.',                                        '["Complete 1000 names","Detailed meanings","Pronunciation guide","Benefits of chanting","Ekadashi significance"]',                               '🪷', 'Sanskrit with translations', 72,  'advanced',     true),
('Hanuman Chalisa',       'hanuman', 'The 40 verses of Hanuman Chalisa with meanings and powerful benefits.',                                      '["Complete Hindi text","Verse-by-verse meaning","Pronunciation guide","Tuesday & Saturday importance","Protection mantras"]',                    '🐒', 'Hindi & English',           24,  'beginner',     true),
('Durga Saptashati',      'devi',    '700 verses glorifying Goddess Durga, the supreme power and divine mother.',                                  '["Complete 13 chapters","Navratri special","Devi Mahatmyam","Chandi path procedure","Sanskrit verses with meaning"]',                           '🔱', 'Sanskrit & English',        156, 'advanced',     true),
('Daily Puja Handbook',   'general', 'Essential guide for daily worship at home with simple rituals and mantras.',                                 '["Morning prayer routine","Evening aarti","Basic altar setup","Common mantras","Offerings guide"]',                                             '🪔', 'Multi-language',            42,  'beginner',     true),
('Vedic Rituals Guide',   'general', 'Comprehensive guide to traditional Vedic ceremonies and their significance.',                                '["Havan/Homam procedure","Yajna significance","Sankalpa methods","Fire ceremony guidelines","Vedic chanting basics"]',                          '🔥', 'Sanskrit & English',        88,  'advanced',     true),
('Festival Puja Calendar','general', 'Complete guide to all major Hindu festivals with puja procedures and significance.',                         '["Annual festival list","Puja timings (muhurat)","Special rituals for each","Fasting guidelines","Traditional customs"]',                        '🎊', 'English & Telugu',          64,  'intermediate', true),
('Bhagavad Gita Summary', 'krishna', 'Essential teachings of Lord Krishna from the Bhagavad Gita for spiritual wisdom.',                          '["18 chapters overview","Key teachings","Yoga philosophies","Life lessons","Sanskrit shlokas with meaning"]',                                    '📖', 'Sanskrit & English',        120, 'intermediate', true),
('Rama Raksha Stotra',    'rama',    'Protective hymn dedicated to Lord Rama for courage, strength, and divine protection.',                       '["Complete Sanskrit text","Protection mantras","Benefits of recitation","Best times to chant","Pronunciation guide"]',                          '🏹', 'Sanskrit & Hindi',          18,  'beginner',     true)
ON CONFLICT DO NOTHING;
