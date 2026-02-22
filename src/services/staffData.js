// Shared staff data management using localStorage
const STORAGE_KEY = 'temple_staff';

// Default staff data
const DEFAULT_STAFF = [
  {
    id: 1,
    fullName: 'Ramesh Kumar',
    role: 'Temple Manager',
    department: 'Administration',
    phoneNumber: '9876543210',
    email: 'ramesh.kumar@temple.com',
    joiningDate: '2015-06-15',
    responsibilities: 'Overall temple operations and daily management. Coordinates with all departments and ensures smooth functioning of temple activities. Manages staff schedules and oversees facility maintenance.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 2,
    fullName: 'Lakshmi Devi',
    role: 'Head Cook',
    department: 'Kitchen',
    phoneNumber: '9876543211',
    email: 'lakshmi.devi@temple.com',
    joiningDate: '2018-03-20',
    responsibilities: 'Manages prasadam preparation and kitchen operations. Ensures quality and hygiene standards. Plans menu for special occasions and festivals. Supervises kitchen staff.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 3,
    fullName: 'Suresh Reddy',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    phoneNumber: '9876543212',
    email: 'suresh.reddy@temple.com',
    joiningDate: '2017-09-10',
    responsibilities: 'Oversees temple maintenance and repairs. Coordinates with contractors for major works. Ensures cleanliness and upkeep of all facilities. Manages maintenance staff and supplies.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 4,
    fullName: 'Anjali Sharma',
    role: 'Office Coordinator',
    department: 'Administration',
    phoneNumber: '9876543213',
    email: 'anjali.sharma@temple.com',
    joiningDate: '2019-01-15',
    responsibilities: 'Handles administrative tasks and office management. Manages visitor inquiries and phone calls. Coordinates event bookings and maintains records. Assists with temple documentation.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 5,
    fullName: 'Venkatesh Rao',
    role: 'Security Officer',
    department: 'Security',
    phoneNumber: '9876543214',
    email: 'venkatesh.rao@temple.com',
    joiningDate: '2016-08-01',
    responsibilities: 'Ensures temple security and safety. Manages security staff and shift schedules. Monitors CCTV systems. Coordinates with local authorities when needed. Oversees parking management.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 6,
    fullName: 'Meena Krishnan',
    role: 'Accounts Assistant',
    department: 'Finance',
    phoneNumber: '9876543215',
    email: 'meena.krishnan@temple.com',
    joiningDate: '2020-02-10',
    responsibilities: 'Assists with accounting and financial record-keeping. Processes donations and maintains receipts. Handles petty cash and expense tracking. Supports treasurer with financial reports.',
    profileImageUrl: '/images/placeholder.svg'
  }
];

// Initialize localStorage with default data if not exists
export const initializeStaff = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
  } else {
    // Repair any staff without IDs
    try {
      const staff = JSON.parse(existing);
      let needsRepair = false;
      
      const repairedStaff = staff.map((member, index) => {
        if (!member.id) {
          needsRepair = true;
          const newId = index + 1;
          console.warn(`Repairing staff member without ID at index ${index}, assigning ID: ${newId}`);
          return { ...member, id: newId };
        }
        return member;
      });
      
      if (needsRepair) {
        console.log('Repaired staff data in localStorage');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repairedStaff));
      }
    } catch (error) {
      console.error('Error repairing staff data:', error);
      // If data is corrupted, reset to defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
    }
  }
};

// Get all staff members
export const getAllStaff = () => {
  initializeStaff();
  const data = localStorage.getItem(STORAGE_KEY);
  const staff = JSON.parse(data);
  
  // Ensure all staff have proper numeric IDs
  return staff.map((member, index) => ({
    ...member,
    id: member.id || (index + 1) // Assign ID if missing
  }));
};

// Get a single staff member by ID
export const getStaffById = (id) => {
  const staff = getAllStaff();
  return staff.find(member => member.id === id);
};

// Get staff by department
export const getStaffByDepartment = (department) => {
  const staff = getAllStaff();
  return staff.filter(member => member.department === department);
};

// Add a new staff member
export const addStaff = (memberData) => {
  const staff = getAllStaff();
  const newId = staff.length > 0 ? Math.max(...staff.map(m => m.id)) + 1 : 1;
  
  const newMember = {
    id: newId,
    ...memberData,
    profileImageUrl: memberData.profileImageUrl || '/images/placeholder.svg'
  };
  
  console.log('Adding new staff member with ID:', newId, newMember);
  staff.push(newMember);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  return newMember;
};

// Update an existing staff member
export const updateStaff = (id, memberData) => {
  console.log('updateStaff called with ID:', id, 'Type:', typeof id);
  const staff = getAllStaff();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const index = staff.findIndex(member => member.id === numericId);
  
  console.log('Found staff member at index:', index);
  
  if (index === -1) {
    throw new Error(`Staff member not found with ID: ${id}`);
  }
  
  staff[index] = {
    ...staff[index],
    ...memberData,
    id: numericId // Ensure ID is numeric
  };
  
  console.log('Updated staff member:', staff[index]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  return staff[index];
};

// Delete a staff member
export const deleteStaff = (id) => {
  const staff = getAllStaff();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const filtered = staff.filter(member => member.id !== numericId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Reset to default staff
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
  return DEFAULT_STAFF;
};
