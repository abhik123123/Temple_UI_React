// Shared daily poojas data management using localStorage
const STORAGE_KEY = 'temple_daily_poojas';

// Days of the week
export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Default daily poojas data
const DEFAULT_POOJAS = [
  {
    id: 1,
    name: 'Morning Suprabhatam',
    time: '05:00',
    duration: '30 minutes',
    day: 'Daily',
    description: 'Wake up prayers to Lord Venkateswara with traditional suprabhatam hymns',
    deity: 'Lord Venkateswara',
    details: ['Suprabhatam chanting', 'Mangala Harathi', 'Fresh flower decoration', 'Open to all devotees'],
    icon: '🌅'
  },
  {
    id: 2,
    name: 'Abhishekam',
    time: '06:00',
    duration: '45 minutes',
    day: 'Daily',
    description: 'Sacred ritual bath for the deity with milk, honey, and other sacred ingredients',
    deity: 'Main Deity',
    details: ['Panchamrutham Abhishekam', 'Sacred mantras', 'Special offerings', 'Prasadam distribution'],
    icon: '🪔'
  },
  {
    id: 3,
    name: 'Sahasranama Archana',
    time: '07:00',
    duration: '60 minutes',
    day: 'Daily',
    description: 'Chanting of 1000 names of the deity with flower offerings',
    deity: 'Lord Vishnu',
    details: ['1000 names chanting', 'Flower archana', 'Vedic hymns', 'Special blessings'],
    icon: '🌺'
  },
  {
    id: 4,
    name: 'Ekadasi Special Pooja',
    time: '08:00',
    duration: '90 minutes',
    day: 'Monday',
    description: 'Special elaborate worship on Ekadasi day with extended rituals',
    deity: 'Lord Vishnu',
    details: ['Extended abhishekam', 'Special alankaram', 'Ekadasi fasting guidance', 'Community prayers'],
    icon: '✨'
  },
  {
    id: 5,
    name: 'Lalitha Sahasranamam',
    time: '09:00',
    duration: '45 minutes',
    day: 'Friday',
    description: '1000 names of Goddess Lalitha, special Friday prayers for feminine divine',
    deity: 'Goddess Lalitha',
    details: ['Traditional chanting', 'Flower offerings', 'Kumkum archana', 'Blessings for families'],
    icon: '🌸'
  },
  {
    id: 6,
    name: 'Rudrabhishekam',
    time: '07:30',
    duration: '60 minutes',
    day: 'Monday',
    description: 'Special abhishekam to Lord Shiva with Rudram chanting on auspicious Mondays',
    deity: 'Lord Shiva',
    details: ['Rudram chanting', 'Bilva leaves offering', 'Milk abhishekam', 'Vibhuti prasadam'],
    icon: '🔱'
  },
  {
    id: 7,
    name: 'Noon Pooja',
    time: '12:00',
    duration: '30 minutes',
    day: 'Daily',
    description: 'Midday prayers and food offerings to the deity',
    deity: 'Main Deity',
    details: ['Naivedyam offering', 'Noon archana', 'Quick darshan', 'Prasadam available'],
    icon: '☀️'
  },
  {
    id: 8,
    name: 'Satyanarayana Vratham',
    time: '10:00',
    duration: '120 minutes',
    day: 'Thursday',
    description: 'Auspicious Satyanarayana pooja performed every Thursday for prosperity',
    deity: 'Lord Satyanarayana',
    details: ['Complete vratham', 'Story narration', 'Prasadam distribution', 'Family participation welcome'],
    icon: '🙏'
  },
  {
    id: 9,
    name: 'Hanuman Chalisa',
    time: '07:00',
    duration: '30 minutes',
    day: 'Tuesday',
    description: 'Special prayers to Lord Hanuman with Chalisa chanting every Tuesday',
    deity: 'Lord Hanuman',
    details: ['Chalisa chanting', 'Sindoor offering', 'Special archana', 'Strength & courage blessings'],
    icon: '💪'
  },
  {
    id: 10,
    name: 'Lakshmi Pooja',
    time: '11:00',
    duration: '45 minutes',
    day: 'Friday',
    description: 'Worship of Goddess Lakshmi for wealth, prosperity and abundance',
    deity: 'Goddess Lakshmi',
    details: ['Lakshmi ashtothram', 'Coin offerings', 'Turmeric kumkum', 'Prosperity blessings'],
    icon: '💰'
  },
  {
    id: 11,
    name: 'Evening Deeparadhana',
    time: '18:00',
    duration: '30 minutes',
    day: 'Daily',
    description: 'Beautiful evening lamp ceremony with traditional songs and prayers',
    deity: 'All Deities',
    details: ['Lamp lighting ceremony', 'Evening hymns', 'Camphor harathi', 'Community participation'],
    icon: '🪔'
  },
  {
    id: 12,
    name: 'Vishnu Sahasranamam',
    time: '19:00',
    duration: '45 minutes',
    day: 'Saturday',
    description: '1000 names of Lord Vishnu chanted on Saturday evenings',
    deity: 'Lord Vishnu',
    details: ['Sahasranamam chanting', 'Tulsi archana', 'Sacred hymns', 'Divine blessings'],
    icon: '🦅'
  },
  {
    id: 13,
    name: 'Night Pooja & Closing',
    time: '20:30',
    duration: '30 minutes',
    day: 'Daily',
    description: 'Final prayers of the day before temple closing with peaceful mantras',
    deity: 'All Deities',
    details: ['Closing prayers', 'Night mantras', 'Deity rest ceremony', 'Final harathi'],
    icon: '🌙'
  }
];

// Initialize localStorage with default data if not exists
export const initializeDailyPoojas = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POOJAS));
  } else {
    // Repair any poojas without IDs
    try {
      const poojas = JSON.parse(existing);
      let needsRepair = false;
      
      const repairedPoojas = poojas.map((pooja, index) => {
        if (!pooja.id) {
          needsRepair = true;
          const newId = index + 1;
          console.warn(`Repairing pooja without ID at index ${index}, assigning ID: ${newId}`);
          return { ...pooja, id: newId };
        }
        return pooja;
      });
      
      if (needsRepair) {
        console.log('Repaired daily poojas data in localStorage');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repairedPoojas));
      }
    } catch (error) {
      console.error('Error repairing daily poojas data:', error);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POOJAS));
    }
  }
};

// Get all daily poojas
export const getAllDailyPoojas = () => {
  initializeDailyPoojas();
  const data = localStorage.getItem(STORAGE_KEY);
  const poojas = JSON.parse(data);
  
  // Ensure all poojas have proper numeric IDs
  return poojas.map((pooja, index) => ({
    ...pooja,
    id: pooja.id || (index + 1)
  }));
};

// Get poojas by day
export const getPoojasByDay = (day) => {
  const poojas = getAllDailyPoojas();
  return poojas.filter(pooja => pooja.day === day || pooja.day === 'Daily');
};

// Get today's poojas
export const getTodaysPoojas = () => {
  const today = DAYS_OF_WEEK[new Date().getDay()];
  return getPoojasByDay(today);
};

// Get a single pooja by ID
export const getPoojaById = (id) => {
  const poojas = getAllDailyPoojas();
  return poojas.find(pooja => pooja.id === id);
};

// Add a new pooja
export const addPooja = (poojaData) => {
  const poojas = getAllDailyPoojas();
  const newId = poojas.length > 0 ? Math.max(...poojas.map(p => p.id)) + 1 : 1;
  
  const newPooja = {
    id: newId,
    ...poojaData,
    details: Array.isArray(poojaData.details) 
      ? poojaData.details 
      : poojaData.details?.split('\n').map(d => d.trim()).filter(d => d) || []
  };
  
  console.log('Adding new pooja with ID:', newId, newPooja);
  poojas.push(newPooja);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(poojas));
  return newPooja;
};

// Update an existing pooja
export const updatePooja = (id, poojaData) => {
  console.log('updatePooja called with ID:', id, 'Type:', typeof id);
  const poojas = getAllDailyPoojas();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const index = poojas.findIndex(pooja => pooja.id === numericId);
  
  console.log('Found pooja at index:', index);
  
  if (index === -1) {
    throw new Error(`Pooja not found with ID: ${id}`);
  }
  
  poojas[index] = {
    ...poojas[index],
    ...poojaData,
    id: numericId,
    details: Array.isArray(poojaData.details) 
      ? poojaData.details 
      : poojaData.details?.split('\n').map(d => d.trim()).filter(d => d) || poojas[index].details
  };
  
  console.log('Updated pooja:', poojas[index]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(poojas));
  return poojas[index];
};

// Delete a pooja
export const deletePooja = (id) => {
  const poojas = getAllDailyPoojas();
  const filtered = poojas.filter(pooja => pooja.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Reset to default poojas
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POOJAS));
  return DEFAULT_POOJAS;
};
