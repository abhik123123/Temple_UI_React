// Shared bajanas data management using localStorage
const STORAGE_KEY = 'temple_bajanas';

// Default bajanas data
const DEFAULT_BAJANAS = [
  {
    id: 1,
    title: 'Shiva Bhajan',
    artist: 'Temple Choir',
    category: 'devotional',
    deity: 'shiva',
    schedule: 'Every Monday at 6:00 PM',
    description: 'Traditional devotional songs dedicated to Lord Shiva, performed during evening prayers.',
    details: ['Sanskrit & Telugu lyrics', 'Duration: 30 minutes', 'Open to all devotees'],
    icon: '🕉️',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 2,
    title: 'Krishna Bhajan',
    artist: 'Devotional Group',
    category: 'devotional',
    deity: 'krishna',
    schedule: 'Janmashtami Special',
    description: 'Melodious bhajans celebrating Lord Krishna, his divine play and teachings.',
    details: ['Classical ragas', 'Group singing', 'Traditional instruments'],
    icon: '🦚',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 3,
    title: 'Devi Stotram',
    artist: 'Temple Priests',
    category: 'devotional',
    deity: 'devi',
    schedule: 'Fridays at 7:30 PM',
    description: 'Sacred hymns praising the Divine Mother in various forms.',
    details: ['Sanskrit chanting', 'Powerful mantras', 'Special occasions'],
    icon: '🔱',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 4,
    title: 'Ganesha Stuti',
    artist: 'Temple Choir',
    category: 'devotional',
    deity: 'ganesha',
    schedule: 'Every Wednesday at 6:30 PM',
    description: 'Auspicious prayers to Lord Ganesha, the remover of obstacles and lord of beginnings.',
    details: ['Sanskrit mantras', 'Traditional melodies', 'Family friendly'],
    icon: '🐘',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 5,
    title: 'Vishnu Sahasranamam',
    artist: 'Vedic Scholars',
    category: 'devotional',
    deity: 'vishnu',
    schedule: 'Every Thursday at 7:00 PM',
    description: 'The thousand names of Lord Vishnu, chanted for peace and prosperity.',
    details: ['1000 sacred names', 'Sanskrit chanting', 'Powerful mantras', 'Duration: 45 minutes'],
    icon: '🪷',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 6,
    title: 'Rama Bhajan',
    artist: 'Devotional Group',
    category: 'devotional',
    deity: 'rama',
    schedule: 'Ram Navami Special',
    description: 'Devotional songs celebrating Lord Rama, his virtues and divine life story.',
    details: ['Ramayana stories', 'Bhakti songs', 'Telugu & Sanskrit', 'All ages welcome'],
    icon: '🏹',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 7,
    title: 'Hanuman Chalisa',
    artist: 'Temple Choir',
    category: 'devotional',
    deity: 'hanuman',
    schedule: 'Every Tuesday & Saturday at 6:00 AM',
    description: 'Powerful 40-verse prayer to Lord Hanuman for strength, courage, and protection.',
    details: ['Hindi devotional', 'Morning prayers', 'Strength & courage', 'Protection mantras'],
    icon: '🐒',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 8,
    title: 'Lakshmi Ashtottara',
    artist: 'Temple Priests',
    category: 'devotional',
    deity: 'devi',
    schedule: 'Fridays during Diwali season',
    description: 'The 108 names of Goddess Lakshmi for prosperity and abundance.',
    details: ['108 sacred names', 'Prosperity prayers', 'Sanskrit chanting', 'Festival special'],
    icon: '💰',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 9,
    title: 'Saraswati Vandana',
    artist: 'Students & Teachers',
    category: 'devotional',
    deity: 'devi',
    schedule: 'During Basant Panchami',
    description: 'Prayers to Goddess Saraswati for knowledge, wisdom, and learning.',
    details: ['Knowledge & wisdom', 'Student prayers', 'Sanskrit verses', 'Educational blessings'],
    icon: '📚',
    hasAudio: true,
    hasLyrics: true
  },
  {
    id: 10,
    title: 'Surya Namaskar Mantra',
    artist: 'Morning Prayer Group',
    category: 'devotional',
    deity: 'vishnu',
    schedule: 'Every Sunday at 6:30 AM',
    description: 'Sacred mantras honoring Surya, the Sun God, for health and vitality.',
    details: ['12 sun salutation mantras', 'Morning energy', 'Health prayers', 'Sanskrit chanting'],
    icon: '☀️',
    hasAudio: true,
    hasLyrics: true
  }
];

// Initialize localStorage with default data if not exists
export const initializeBajanas = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BAJANAS));
  }
};

// Get all bajanas
export const getAllBajanas = () => {
  initializeBajanas();
  const data = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(data);
};

// Get a single bajana by ID
export const getBajanaById = (id) => {
  const bajanas = getAllBajanas();
  return bajanas.find(bajana => bajana.id === id);
};

// Add a new bajana
export const addBajana = (bajanaData) => {
  const bajanas = getAllBajanas();
  const newId = bajanas.length > 0 ? Math.max(...bajanas.map(b => b.id)) + 1 : 1;
  
  const newBajana = {
    id: newId,
    ...bajanaData,
    details: Array.isArray(bajanaData.details) 
      ? bajanaData.details 
      : bajanaData.details?.split(',').map(d => d.trim()).filter(d => d) || [],
    hasAudio: bajanaData.hasAudio !== undefined ? bajanaData.hasAudio : false,
    hasLyrics: bajanaData.hasLyrics !== undefined ? bajanaData.hasLyrics : false
  };
  
  bajanas.push(newBajana);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bajanas));
  return newBajana;
};

// Update an existing bajana
export const updateBajana = (id, bajanaData) => {
  const bajanas = getAllBajanas();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const index = bajanas.findIndex(bajana => bajana.id === numericId);
  
  if (index === -1) {
    throw new Error(`Bajana not found with ID: ${id}`);
  }
  
  bajanas[index] = {
    ...bajanas[index],
    ...bajanaData,
    id: numericId,
    details: Array.isArray(bajanaData.details) 
      ? bajanaData.details 
      : bajanaData.details?.split(',').map(d => d.trim()).filter(d => d) || bajanas[index].details
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bajanas));
  return bajanas[index];
};

// Delete a bajana
export const deleteBajana = (id) => {
  const bajanas = getAllBajanas();
  const filtered = bajanas.filter(bajana => bajana.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Reset to default bajanas
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BAJANAS));
  return DEFAULT_BAJANAS;
};
