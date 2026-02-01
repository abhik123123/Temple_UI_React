// Local storage key for staff data
const STAFF_STORAGE_KEY = 'temple_staff_members';

// Initialize with default staff data if not exists
const initializeStaffData = () => {
  const existing = localStorage.getItem(STAFF_STORAGE_KEY);
  if (!existing) {
    const defaultStaff = [
      {
        id: 1,
        fullName: 'Pandit Ramesh Kumar',
        phoneNumber: '+91-9876543210',
        email: 'ramesh.kumar@temple.com',
        position: 'Head Priest',
        department: 'Religious',
        profileImageUrl: '',
        biography: 'Senior priest with over 20 years of experience in temple rituals and ceremonies.'
      },
      {
        id: 2,
        fullName: 'Pandit Suresh Sharma',
        phoneNumber: '+91-9876543211',
        email: 'suresh.sharma@temple.com',
        position: 'Priest (Ayagaru-Poojari)',
        department: 'Religious',
        profileImageUrl: '',
        biography: 'Dedicated to performing daily poojas and special ceremonies.'
      },
      {
        id: 3,
        fullName: 'Mr. Vijay Patel',
        phoneNumber: '+91-9876543212',
        email: 'vijay.patel@temple.com',
        position: 'Temple Manager',
        department: 'Administration',
        profileImageUrl: '',
        biography: 'Manages day-to-day operations and administrative functions.'
      }
    ];
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(defaultStaff));
  }
};

// Get all staff from localStorage
const getAllStaff = () => {
  initializeStaffData();
  const data = localStorage.getItem(STAFF_STORAGE_KEY);
  return JSON.parse(data || '[]');
};

// Save staff to localStorage
const saveStaff = (staff) => {
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
};

export const staffAPI = {
  getAll: () => {
    return Promise.resolve({ data: getAllStaff() });
  },
  
  getByDepartment: (department) => {
    const allStaff = getAllStaff();
    const filtered = allStaff.filter(member => member.department === department);
    return Promise.resolve({ data: filtered });
  },
  
  getById: (id) => {
    const allStaff = getAllStaff();
    const member = allStaff.find(m => m.id === parseInt(id));
    return Promise.resolve({ data: member });
  },
  
  create: (data) => {
    const allStaff = getAllStaff();
    const newMember = {
      ...data,
      id: Math.max(0, ...allStaff.map(m => m.id)) + 1
    };
    allStaff.push(newMember);
    saveStaff(allStaff);
    return Promise.resolve({ data: newMember });
  },
  
  update: (id, data) => {
    const allStaff = getAllStaff();
    const index = allStaff.findIndex(m => m.id === parseInt(id));
    if (index !== -1) {
      allStaff[index] = { ...allStaff[index], ...data };
      saveStaff(allStaff);
      return Promise.resolve({ data: allStaff[index] });
    }
    return Promise.reject(new Error('Staff member not found'));
  },
  
  delete: (id) => {
    const allStaff = getAllStaff();
    const filtered = allStaff.filter(m => m.id !== parseInt(id));
    saveStaff(filtered);
    return Promise.resolve({ data: { success: true } });
  }
};
