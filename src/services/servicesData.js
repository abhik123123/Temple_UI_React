// Shared services data management using localStorage
const STORAGE_KEY = 'temple_services';

// Default services data
const DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Daily Pujas',
    price: 'Free',
    description: 'Participate in our daily morning and evening prayer services.',
    details: ['Morning Prayers at 5:00 AM', 'Evening Prayers at 7:00 PM', 'Guided meditation'],
    icon: '🙏'
  },
  {
    id: 2,
    name: 'Special Prayers',
    price: '₹500 - ₹2000',
    description: 'Customized prayer ceremonies for special occasions and personal intentions.',
    details: ['Family blessings', 'Health & wellness prayers', 'Success rituals'],
    icon: '✨'
  },
  {
    id: 3,
    name: 'Spiritual Counseling',
    price: '₹1000/session',
    description: 'One-on-one guidance from our experienced spiritual advisors.',
    details: ['Personal consultation', 'Life guidance', 'Spiritual development'],
    icon: '📖'
  },
  {
    id: 4,
    name: 'Bajanas (Bhajans)',
    price: 'Free',
    description: 'Join our devotional singing sessions and spiritual music gatherings.',
    details: ['Daily bhajan sessions', 'Festival special performances', 'Community participation welcome'],
    icon: '🎵'
  },
  {
    id: 5,
    name: 'Yoga & Meditation',
    price: '₹2000/month',
    description: 'Regular classes for physical and mental wellness.',
    details: ['Morning yoga classes', 'Evening meditation', 'Breathing techniques'],
    icon: '🧘'
  },
  {
    id: 6,
    name: 'Temple Tours',
    price: '₹200/person',
    description: 'Guided tours explaining the temple history and architecture.',
    details: ['Heritage tour', 'Historical insights', 'Photography allowed'],
    icon: '🏛️'
  }
];

// Initialize localStorage with default data if not exists
export const initializeServices = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES));
  } else {
    // Repair any services without IDs
    try {
      const services = JSON.parse(existing);
      let needsRepair = false;
      
      const repairedServices = services.map((service, index) => {
        if (!service.id) {
          needsRepair = true;
          const newId = index + 1;
          console.warn(`Repairing service without ID at index ${index}, assigning ID: ${newId}`);
          return { ...service, id: newId };
        }
        return service;
      });
      
      if (needsRepair) {
        console.log('Repaired services data in localStorage');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repairedServices));
      }
    } catch (error) {
      console.error('Error repairing services data:', error);
      // If data is corrupted, reset to defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES));
    }
  }
};

// Get all services
export const getAllServices = () => {
  initializeServices();
  const data = localStorage.getItem(STORAGE_KEY);
  const services = JSON.parse(data);
  
  // Ensure all services have proper numeric IDs
  return services.map((service, index) => ({
    ...service,
    id: service.id || (index + 1) // Assign ID if missing
  }));
};

// Get a single service by ID
export const getServiceById = (id) => {
  const services = getAllServices();
  return services.find(service => service.id === id);
};

// Add a new service
export const addService = (serviceData) => {
  const services = getAllServices();
  const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
  
  const newService = {
    id: newId, // Put ID first
    ...serviceData,
    details: Array.isArray(serviceData.details) 
      ? serviceData.details 
      : serviceData.details?.split(',').map(d => d.trim()).filter(d => d) || []
  };
  
  console.log('Adding new service with ID:', newId, newService);
  services.push(newService);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  return newService;
};

// Update an existing service
export const updateService = (id, serviceData) => {
  console.log('updateService called with ID:', id, 'Type:', typeof id);
  const services = getAllServices();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const index = services.findIndex(service => service.id === numericId);
  
  console.log('Found service at index:', index);
  
  if (index === -1) {
    throw new Error(`Service not found with ID: ${id}`);
  }
  
  services[index] = {
    ...services[index],
    ...serviceData,
    id: numericId, // Ensure ID is numeric
    details: Array.isArray(serviceData.details) 
      ? serviceData.details 
      : serviceData.details?.split(',').map(d => d.trim()).filter(d => d) || services[index].details
  };
  
  console.log('Updated service:', services[index]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  return services[index];
};

// Delete a service
export const deleteService = (id) => {
  const services = getAllServices();
  const filtered = services.filter(service => service.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Reset to default services
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
};
