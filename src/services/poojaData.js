// Shared pooja books data management using localStorage
const STORAGE_KEY = 'temple_pooja_books';

// Default pooja books data
const DEFAULT_POOJA_BOOKS = [
  {
    id: 1,
    title: 'Shiva Puja Vidhanam',
    category: 'shiva',
    description: 'Complete guide to performing Shiva worship with mantras, rituals, and offerings.',
    details: [
      'Rudrabhishekam procedure',
      'Bilva patra significance',
      'Maha Mrityunjaya Mantra',
      'Monday fasting guidelines',
      'Pradosha puja method'
    ],
    icon: '🕉️',
    language: 'Sanskrit & English',
    pages: 45,
    downloadable: true,
    level: 'intermediate'
  },
  {
    id: 2,
    title: 'Ganesha Puja Guide',
    category: 'ganesha',
    description: 'Step-by-step instructions for Ganesha worship for removing obstacles and new beginnings.',
    details: [
      'Ganapati Atharvashirsha',
      'Modak offering tradition',
      'Chaturthi puja significance',
      'Ganesha mantras & stotras',
      'Daily worship procedure'
    ],
    icon: '🐘',
    language: 'Sanskrit & English',
    pages: 32,
    downloadable: true,
    level: 'beginner'
  },
  {
    id: 3,
    title: 'Lakshmi Puja Paddhati',
    category: 'devi',
    description: 'Traditional methods of Goddess Lakshmi worship for prosperity and abundance.',
    details: [
      'Friday Lakshmi puja',
      'Diwali Lakshmi puja complete',
      'Mahalakshmi Ashtakam',
      'Offering procedures',
      'Wealth mantras'
    ],
    icon: '💰',
    language: 'Sanskrit & Telugu',
    pages: 38,
    downloadable: true,
    level: 'intermediate'
  },
  {
    id: 4,
    title: 'Saraswati Vandana',
    category: 'devi',
    description: 'Worship guide for Goddess Saraswati for knowledge, wisdom, and learning success.',
    details: [
      'Basant Panchami puja',
      'Student prayer mantras',
      'Saraswati Stotram',
      'Book worship tradition',
      'Vidya puja procedure'
    ],
    icon: '📚',
    language: 'Sanskrit & Hindi',
    pages: 28,
    downloadable: true,
    level: 'beginner'
  },
  {
    id: 5,
    title: 'Vishnu Sahasranamam',
    category: 'vishnu',
    description: 'The thousand names of Lord Vishnu with meanings and chanting guide.',
    details: [
      'Complete 1000 names',
      'Detailed meanings',
      'Pronunciation guide',
      'Benefits of chanting',
      'Ekadashi significance'
    ],
    icon: '🪷',
    language: 'Sanskrit with translations',
    pages: 72,
    downloadable: true,
    level: 'advanced'
  },
  {
    id: 6,
    title: 'Hanuman Chalisa',
    category: 'hanuman',
    description: 'The 40 verses of Hanuman Chalisa with meanings and powerful benefits.',
    details: [
      'Complete Hindi text',
      'Verse-by-verse meaning',
      'Pronunciation guide',
      'Tuesday & Saturday importance',
      'Protection mantras'
    ],
    icon: '🐒',
    language: 'Hindi & English',
    pages: 24,
    downloadable: true,
    level: 'beginner'
  },
  {
    id: 7,
    title: 'Durga Saptashati',
    category: 'devi',
    description: '700 verses glorifying Goddess Durga, the supreme power and divine mother.',
    details: [
      'Complete 13 chapters',
      'Navratri special',
      'Devi Mahatmyam',
      'Chandi path procedure',
      'Sanskrit verses with meaning'
    ],
    icon: '🔱',
    language: 'Sanskrit & English',
    pages: 156,
    downloadable: true,
    level: 'advanced'
  },
  {
    id: 8,
    title: 'Daily Puja Handbook',
    category: 'general',
    description: 'Essential guide for daily worship at home with simple rituals and mantras.',
    details: [
      'Morning prayer routine',
      'Evening aarti',
      'Basic altar setup',
      'Common mantras',
      'Offerings guide'
    ],
    icon: '🪔',
    language: 'Multi-language',
    pages: 42,
    downloadable: true,
    level: 'beginner'
  },
  {
    id: 9,
    title: 'Vedic Rituals Guide',
    category: 'general',
    description: 'Comprehensive guide to traditional Vedic ceremonies and their significance.',
    details: [
      'Havan/Homam procedure',
      'Yajna significance',
      'Sankalpa methods',
      'Fire ceremony guidelines',
      'Vedic chanting basics'
    ],
    icon: '🔥',
    language: 'Sanskrit & English',
    pages: 88,
    downloadable: true,
    level: 'advanced'
  },
  {
    id: 10,
    title: 'Festival Puja Calendar',
    category: 'general',
    description: 'Complete guide to all major Hindu festivals with puja procedures and significance.',
    details: [
      'Annual festival list',
      'Puja timings (muhurat)',
      'Special rituals for each',
      'Fasting guidelines',
      'Traditional customs'
    ],
    icon: '🎊',
    language: 'English & Telugu',
    pages: 64,
    downloadable: true,
    level: 'intermediate'
  },
  {
    id: 11,
    title: 'Bhagavad Gita Summary',
    category: 'krishna',
    description: 'Essential teachings of Lord Krishna from the Bhagavad Gita for spiritual wisdom.',
    details: [
      '18 chapters overview',
      'Key teachings',
      'Yoga philosophies',
      'Life lessons',
      'Sanskrit shlokas with meaning'
    ],
    icon: '📖',
    language: 'Sanskrit & English',
    pages: 120,
    downloadable: true,
    level: 'intermediate'
  },
  {
    id: 12,
    title: 'Rama Raksha Stotra',
    category: 'rama',
    description: 'Protective hymn dedicated to Lord Rama for courage, strength, and divine protection.',
    details: [
      'Complete Sanskrit text',
      'Protection mantras',
      'Benefits of recitation',
      'Best times to chant',
      'Pronunciation guide'
    ],
    icon: '🏹',
    language: 'Sanskrit & Hindi',
    pages: 18,
    downloadable: true,
    level: 'beginner'
  }
];

// Initialize localStorage with default data if not exists
export const initializePoojaBooks = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POOJA_BOOKS));
  }
};

// Get all pooja books
export const getAllPoojaBooks = () => {
  initializePoojaBooks();
  const data = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(data);
};

// Get a single pooja book by ID
export const getPoojaBookById = (id) => {
  const books = getAllPoojaBooks();
  return books.find(book => book.id === id);
};

// Add a new pooja book
export const addPoojaBook = (bookData) => {
  const books = getAllPoojaBooks();
  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  
  const newBook = {
    id: newId,
    ...bookData,
    details: Array.isArray(bookData.details) 
      ? bookData.details 
      : bookData.details?.split(',').map(d => d.trim()).filter(d => d) || [],
    downloadable: bookData.downloadable !== undefined ? bookData.downloadable : true
  };
  
  books.push(newBook);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return newBook;
};

// Update an existing pooja book
export const updatePoojaBook = (id, bookData) => {
  const books = getAllPoojaBooks();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const index = books.findIndex(book => book.id === numericId);
  
  if (index === -1) {
    throw new Error(`Pooja book not found with ID: ${id}`);
  }
  
  books[index] = {
    ...books[index],
    ...bookData,
    id: numericId,
    details: Array.isArray(bookData.details) 
      ? bookData.details 
      : bookData.details?.split(',').map(d => d.trim()).filter(d => d) || books[index].details
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return books[index];
};

// Delete a pooja book
export const deletePoojaBook = (id) => {
  const books = getAllPoojaBooks();
  const filtered = books.filter(book => book.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Reset to default pooja books
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POOJA_BOOKS));
  return DEFAULT_POOJA_BOOKS;
};
