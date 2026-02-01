/**
 * templeAPI.js - Local Storage API service for all temple management
 * All data is stored in browser's localStorage - no backend required
 */

// Local Storage Keys
const STORAGE_KEYS = {
  EVENTS: 'temple_events',
  SERVICES: 'temple_services',
  STAFF: 'temple_staff',
  BOARD_MEMBERS: 'temple_board_members',
  TIMINGS: 'temple_timings',
  DONORS: 'temple_donors',
  PRIESTS: 'temple_priests',
  IMAGES: 'temple_images',
  AUTH_TOKEN: 'temple_auth_token',
  CURRENT_USER: 'temple_current_user'
};

// Helper function to generate unique IDs
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

// Helper function to get data from localStorage
const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

// Initialize default data
const initializeDefaultData = () => {
  // Initialize Events if empty
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    const defaultEvents = [
      {
        id: generateId(),
        title: 'Diwali Celebration',
        eventName: 'Diwali Celebration',
        date: '2026-11-15',
        eventDate: '2026-11-15',
        startTime: '18:00:00',
        endTime: '22:00:00',
        location: 'Temple Main Hall',
        description: 'Join us for a spectacular Diwali celebration with traditional rituals, prayers, and community gathering.',
        category: 'Festival',
        status: 'Upcoming',
        imageUrl: null,
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Lord Shiva Puja',
        eventName: 'Lord Shiva Puja',
        date: '2026-12-01',
        eventDate: '2026-12-01',
        startTime: '06:00:00',
        endTime: '08:00:00',
        location: 'Inner Sanctum',
        description: 'Special prayer ceremony dedicated to Lord Shiva.',
        category: 'Religious',
        status: 'Upcoming',
        imageUrl: null,
        createdAt: new Date().toISOString()
      }
    ];
    saveToStorage(STORAGE_KEYS.EVENTS, defaultEvents);
  }

  // Initialize Services if empty
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    const defaultServices = [
      {
        id: generateId(),
        serviceName: 'Abhishekam',
        description: 'Sacred bathing ceremony of the deity',
        price: '51.00',
        duration: '30 minutes',
        category: 'Ritual',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        serviceName: 'Archana',
        description: 'Special prayer offering with 108 names',
        price: '21.00',
        duration: '20 minutes',
        category: 'Prayer',
        createdAt: new Date().toISOString()
      }
    ];
    saveToStorage(STORAGE_KEYS.SERVICES, defaultServices);
  }

  // Initialize Timings if empty
  if (!localStorage.getItem(STORAGE_KEYS.TIMINGS)) {
    const defaultTimings = [
      { 
        day: 'Monday', 
        notes: 'Multiple Sessions',
        slots: [
          { id: generateId(), openTime: '06:00:00', closeTime: '13:00:00' },
          { id: generateId(), openTime: '16:00:00', closeTime: '21:00:00' }
        ]
      },
      { 
        day: 'Tuesday', 
        notes: 'Regular Schedule',
        slots: [
          { id: generateId(), openTime: '06:00:00', closeTime: '13:00:00' },
          { id: generateId(), openTime: '16:00:00', closeTime: '21:00:00' }
        ]
      },
      { 
        day: 'Wednesday', 
        notes: 'Regular Schedule',
        slots: [
          { id: generateId(), openTime: '06:00:00', closeTime: '13:00:00' },
          { id: generateId(), openTime: '16:00:00', closeTime: '21:00:00' }
        ]
      },
      { 
        day: 'Thursday', 
        notes: 'Regular Schedule',
        slots: [
          { id: generateId(), openTime: '06:00:00', closeTime: '13:00:00' },
          { id: generateId(), openTime: '16:00:00', closeTime: '21:00:00' }
        ]
      },
      { 
        day: 'Friday', 
        notes: 'Regular Schedule',
        slots: [
          { id: generateId(), openTime: '06:00:00', closeTime: '13:00:00' },
          { id: generateId(), openTime: '16:00:00', closeTime: '21:00:00' }
        ]
      },
      { 
        day: 'Saturday', 
        notes: 'Extended Hours',
        slots: [
          { id: generateId(), openTime: '06:00:00', closeTime: '21:00:00' }
        ]
      },
      { 
        day: 'Sunday', 
        notes: 'Weekend Schedule',
        slots: [
          { id: generateId(), openTime: '07:00:00', closeTime: '21:00:00' }
        ]
      }
    ];
    saveToStorage(STORAGE_KEYS.TIMINGS, defaultTimings);
  }

  // Initialize default admin user if empty
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    const defaultUser = {
      id: 1,
      username: 'admin',
      role: 'admin',
      email: 'admin@temple.com'
    };
    saveToStorage(STORAGE_KEYS.CURRENT_USER, defaultUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'local-admin-token');
  }
};

// Initialize on load
initializeDefaultData();

/**
 * ============ EVENTS API ============
 */
export const eventsAPI = {
  // Get all events
  getAll: async (params = {}) => {
    const events = getFromStorage(STORAGE_KEYS.EVENTS, []);
    return Promise.resolve({ data: events });
  },

  // Get single event
  getById: async (id) => {
    const events = getFromStorage(STORAGE_KEYS.EVENTS, []);
    const event = events.find(e => e.id === id);
    return Promise.resolve({ data: event });
  },

  // Create event
  create: async (eventData) => {
    const events = getFromStorage(STORAGE_KEYS.EVENTS, []);
    
    let newEvent;
    if (eventData instanceof FormData) {
      // Extract data from FormData
      const eventBlob = eventData.get('event');
      const photoFile = eventData.get('photo');
      
      // If event is a Blob, read it as text first
      if (eventBlob instanceof Blob) {
        const eventText = await eventBlob.text();
        newEvent = JSON.parse(eventText);
      } else if (typeof eventBlob === 'string') {
        newEvent = JSON.parse(eventBlob);
      } else {
        newEvent = eventBlob;
      }
      
      // Convert image to base64 for storage
      if (photoFile && photoFile instanceof File) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
        newEvent.imageUrl = base64;
      }
    } else {
      newEvent = eventData;
    }
    
    newEvent.id = generateId();
    newEvent.title = newEvent.eventName || newEvent.title;
    newEvent.date = newEvent.eventDate || newEvent.date;
    newEvent.createdAt = new Date().toISOString();
    
    events.push(newEvent);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    
    return Promise.resolve({ data: newEvent });
  },

  // Update event
  update: async (id, eventData) => {
    const events = getFromStorage(STORAGE_KEYS.EVENTS, []);
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) {
      return Promise.reject(new Error('Event not found'));
    }
    
    let updatedEvent;
    if (eventData instanceof FormData) {
      const eventBlob = eventData.get('event');
      const photoFile = eventData.get('photo');
      
      // If event is a Blob, read it as text first
      if (eventBlob instanceof Blob) {
        const eventText = await eventBlob.text();
        updatedEvent = JSON.parse(eventText);
      } else if (typeof eventBlob === 'string') {
        updatedEvent = JSON.parse(eventBlob);
      } else {
        updatedEvent = eventBlob;
      }
      
      if (photoFile && photoFile instanceof File) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
        updatedEvent.imageUrl = base64;
      } else {
        updatedEvent.imageUrl = events[index].imageUrl;
      }
    } else {
      updatedEvent = eventData;
      updatedEvent.imageUrl = updatedEvent.imageUrl || events[index].imageUrl;
    }
    
    updatedEvent.id = id;
    updatedEvent.title = updatedEvent.eventName || updatedEvent.title;
    updatedEvent.date = updatedEvent.eventDate || updatedEvent.date;
    updatedEvent.updatedAt = new Date().toISOString();
    
    events[index] = { ...events[index], ...updatedEvent };
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    
    return Promise.resolve({ data: events[index] });
  },

  // Delete event
  delete: async (id) => {
    const events = getFromStorage(STORAGE_KEYS.EVENTS, []);
    const filtered = events.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EVENTS, filtered);
    return Promise.resolve({ data: { message: 'Event deleted successfully' } });
  },

  // Register for event
  register: async (registrationData) => {
    // Store registrations in localStorage
    const registrations = getFromStorage('temple_registrations', []);
    const newRegistration = {
      id: generateId(),
      ...registrationData,
      createdAt: new Date().toISOString()
    };
    registrations.push(newRegistration);
    saveToStorage('temple_registrations', registrations);
    return Promise.resolve({ data: newRegistration });
  }
};

/**
 * ============ SERVICES API ============
 */
export const servicesAPI = {
  getAll: async (params = {}) => {
    const services = getFromStorage(STORAGE_KEYS.SERVICES, []);
    return Promise.resolve({ data: services });
  },

  getById: async (id) => {
    const services = getFromStorage(STORAGE_KEYS.SERVICES, []);
    const service = services.find(s => s.id === id);
    return Promise.resolve({ data: service });
  },

  create: async (serviceData) => {
    const services = getFromStorage(STORAGE_KEYS.SERVICES, []);
    const newService = {
      id: generateId(),
      ...serviceData,
      createdAt: new Date().toISOString()
    };
    services.push(newService);
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return Promise.resolve({ data: newService });
  },

  update: async (id, serviceData) => {
    const services = getFromStorage(STORAGE_KEYS.SERVICES, []);
    const index = services.findIndex(s => s.id === id);
    if (index === -1) return Promise.reject(new Error('Service not found'));
    
    services[index] = { ...services[index], ...serviceData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return Promise.resolve({ data: services[index] });
  },

  delete: async (id) => {
    const services = getFromStorage(STORAGE_KEYS.SERVICES, []);
    const filtered = services.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SERVICES, filtered);
    return Promise.resolve({ data: { message: 'Service deleted successfully' } });
  }
};

/**
 * ============ STAFF API ============
 */
export const staffAPI = {
  getAll: async (params = {}) => {
    const staff = getFromStorage(STORAGE_KEYS.STAFF, []);
    return Promise.resolve({ data: staff });
  },

  getById: async (id) => {
    const staff = getFromStorage(STORAGE_KEYS.STAFF, []);
    const member = staff.find(s => s.id === id);
    return Promise.resolve({ data: member });
  },

  create: async (staffData) => {
    const staff = getFromStorage(STORAGE_KEYS.STAFF, []);
    const newMember = {
      id: generateId(),
      ...staffData,
      createdAt: new Date().toISOString()
    };
    staff.push(newMember);
    saveToStorage(STORAGE_KEYS.STAFF, staff);
    return Promise.resolve({ data: newMember });
  },

  update: async (id, staffData) => {
    const staff = getFromStorage(STORAGE_KEYS.STAFF, []);
    const index = staff.findIndex(s => s.id === id);
    if (index === -1) return Promise.reject(new Error('Staff member not found'));
    
    staff[index] = { ...staff[index], ...staffData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.STAFF, staff);
    return Promise.resolve({ data: staff[index] });
  },

  delete: async (id) => {
    const staff = getFromStorage(STORAGE_KEYS.STAFF, []);
    const filtered = staff.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.STAFF, filtered);
    return Promise.resolve({ data: { message: 'Staff member deleted successfully' } });
  }
};

/**
 * ============ TIMINGS API ============
 */
export const timingsAPI = {
  getAll: async () => {
    const timings = getFromStorage(STORAGE_KEYS.TIMINGS, []);
    return Promise.resolve({ data: timings });
  },

  update: async (day, timingData) => {
    const timings = getFromStorage(STORAGE_KEYS.TIMINGS, []);
    const index = timings.findIndex(t => t.day === day);
    
    if (index === -1) {
      timings.push({ day, ...timingData });
    } else {
      timings[index] = { ...timings[index], ...timingData };
    }
    
    saveToStorage(STORAGE_KEYS.TIMINGS, timings);
    return Promise.resolve({ data: timings[index] });
  },

  addHoliday: async (holidayData) => {
    const holidays = getFromStorage('temple_holidays', []);
    const newHoliday = {
      id: generateId(),
      ...holidayData,
      createdAt: new Date().toISOString()
    };
    holidays.push(newHoliday);
    saveToStorage('temple_holidays', holidays);
    return Promise.resolve({ data: newHoliday });
  },

  removeHoliday: async (id) => {
    const holidays = getFromStorage('temple_holidays', []);
    const filtered = holidays.filter(h => h.id !== id);
    saveToStorage('temple_holidays', filtered);
    return Promise.resolve({ data: { message: 'Holiday removed successfully' } });
  }
};

/**
 * ============ DONORS API ============
 */
export const donorsAPI = {
  getAll: async (params = {}) => {
    const donors = getFromStorage(STORAGE_KEYS.DONORS, []);
    return Promise.resolve({ data: donors });
  },

  getById: async (id) => {
    const donors = getFromStorage(STORAGE_KEYS.DONORS, []);
    const donor = donors.find(d => d.id === id);
    return Promise.resolve({ data: donor });
  },

  create: async (donorData) => {
    const donors = getFromStorage(STORAGE_KEYS.DONORS, []);
    const newDonor = {
      id: generateId(),
      ...donorData,
      createdAt: new Date().toISOString()
    };
    donors.push(newDonor);
    saveToStorage(STORAGE_KEYS.DONORS, donors);
    return Promise.resolve({ data: newDonor });
  },

  update: async (id, donorData) => {
    const donors = getFromStorage(STORAGE_KEYS.DONORS, []);
    const index = donors.findIndex(d => d.id === id);
    if (index === -1) return Promise.reject(new Error('Donor not found'));
    
    donors[index] = { ...donors[index], ...donorData, updatedAt: new Date().toISOString() };
    saveToStorage(STORAGE_KEYS.DONORS, donors);
    return Promise.resolve({ data: donors[index] });
  },

  delete: async (id) => {
    const donors = getFromStorage(STORAGE_KEYS.DONORS, []);
    const filtered = donors.filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.DONORS, filtered);
    return Promise.resolve({ data: { message: 'Donor deleted successfully' } });
  }
};

/**
 * ============ AUTHENTICATION API ============
 */
export const authAPI = {
  login: async (credentials) => {
    // Simple local authentication
    const { username, password } = credentials;
    
    // Default credentials
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: 1,
        username: 'admin',
        role: 'admin',
        email: 'admin@temple.com'
      };
      
      const token = 'local-admin-token-' + Date.now();
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      
      return Promise.resolve({ 
        data: { 
          token, 
          user,
          message: 'Login successful' 
        } 
      });
    }
    
    return Promise.reject(new Error('Invalid credentials. Use: admin/admin123'));
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return Promise.resolve({ data: { message: 'Logged out successfully' } });
  },

  getCurrentUser: async () => {
    const user = getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    if (user) {
      return Promise.resolve({ data: user });
    }
    return Promise.reject(new Error('No user logged in'));
  }
};

/**
 * ============ IMAGES API ============
 */
export const imagesAPI = {
  getAll: async () => {
    const images = getFromStorage(STORAGE_KEYS.IMAGES, []);
    return Promise.resolve({ data: images });
  },

  upload: async (formData) => {
    const images = getFromStorage(STORAGE_KEYS.IMAGES, []);
    const file = formData.get('image');
    const title = formData.get('title') || 'Untitled';
    const description = formData.get('description') || '';
    
    if (file) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      
      const newImage = {
        id: generateId(),
        title,
        description,
        imageUrl: base64,
        fileName: file.name,
        createdAt: new Date().toISOString()
      };
      
      images.push(newImage);
      saveToStorage(STORAGE_KEYS.IMAGES, images);
      return Promise.resolve({ data: newImage });
    }
    
    return Promise.reject(new Error('No image file provided'));
  },

  delete: async (id) => {
    const images = getFromStorage(STORAGE_KEYS.IMAGES, []);
    const filtered = images.filter(img => img.id !== id);
    saveToStorage(STORAGE_KEYS.IMAGES, filtered);
    return Promise.resolve({ data: { message: 'Image deleted successfully' } });
  }
};

// Export storage keys for direct access if needed
export { STORAGE_KEYS };

// Default export
export default {
  eventsAPI,
  servicesAPI,
  staffAPI,
  timingsAPI,
  donorsAPI,
  authAPI,
  imagesAPI
};
