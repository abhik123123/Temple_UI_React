// Shared board members data management using localStorage
const STORAGE_KEY = 'temple_board_members';

// Default board members data
const DEFAULT_BOARD_MEMBERS = [
  {
    id: 1,
    fullName: 'Rajesh Kumar',
    position: 'President',
    department: 'Leadership',
    phoneNumber: '9876543210',
    email: 'rajesh.kumar@temple.com',
    biography: 'Rajesh Kumar has been serving as the President of our temple board for the past 10 years. With over 20 years of experience in community service and temple management, he has been instrumental in organizing various cultural and religious events.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 2,
    fullName: 'Priya Sharma',
    position: 'Vice President',
    department: 'Leadership',
    phoneNumber: '9876543211',
    email: 'priya.sharma@temple.com',
    biography: 'Priya Sharma is our Vice President with expertise in financial management and administration. She oversees the temple operations and ensures smooth functioning of all activities.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 3,
    fullName: 'Amit Patel',
    position: 'Treasurer',
    department: 'Finance',
    phoneNumber: '9876543212',
    email: 'amit.patel@temple.com',
    biography: 'Amit Patel manages the temple finances with great diligence. With a background in accounting and 15 years of experience, he ensures transparent financial operations.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 4,
    fullName: 'Lakshmi Reddy',
    position: 'Secretary',
    department: 'Administration',
    phoneNumber: '9876543213',
    email: 'lakshmi.reddy@temple.com',
    biography: 'Lakshmi Reddy serves as the Secretary and maintains all temple records and documentation. She is responsible for coordinating meetings and communications.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 5,
    fullName: 'Venkat Rao',
    position: 'Cultural Head',
    department: 'Cultural Affairs',
    phoneNumber: '9876543214',
    email: 'venkat.rao@temple.com',
    biography: 'Venkat Rao leads our cultural initiatives and festival celebrations. With deep knowledge of traditions and rituals, he ensures authentic religious observances.',
    profileImageUrl: '/images/placeholder.svg'
  },
  {
    id: 6,
    fullName: 'Sunita Krishnan',
    position: 'Youth Coordinator',
    department: 'Youth Services',
    phoneNumber: '9876543215',
    email: 'sunita.krishnan@temple.com',
    biography: 'Sunita Krishnan manages youth programs and educational initiatives. She organizes workshops, classes, and activities for children and young adults.',
    profileImageUrl: '/images/placeholder.svg'
  }
];

// Initialize localStorage with default data if not exists
export const initializeBoardMembers = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOARD_MEMBERS));
  } else {
    // Repair any members without IDs
    try {
      const members = JSON.parse(existing);
      let needsRepair = false;
      
      const repairedMembers = members.map((member, index) => {
        if (!member.id) {
          needsRepair = true;
          const newId = index + 1;
          console.warn(`Repairing board member without ID at index ${index}, assigning ID: ${newId}`);
          return { ...member, id: newId };
        }
        return member;
      });
      
      if (needsRepair) {
        console.log('Repaired board members data in localStorage');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repairedMembers));
      }
    } catch (error) {
      console.error('Error repairing board members data:', error);
      // If data is corrupted, reset to defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOARD_MEMBERS));
    }
  }
};

// Get all board members
export const getAllBoardMembers = () => {
  initializeBoardMembers();
  const data = localStorage.getItem(STORAGE_KEY);
  const members = JSON.parse(data);
  
  // Ensure all members have proper numeric IDs
  return members.map((member, index) => ({
    ...member,
    id: member.id || (index + 1) // Assign ID if missing
  }));
};

// Get a single board member by ID
export const getBoardMemberById = (id) => {
  const members = getAllBoardMembers();
  return members.find(member => member.id === id);
};

// Get board members by department
export const getBoardMembersByDepartment = (department) => {
  const members = getAllBoardMembers();
  return members.filter(member => member.department === department);
};

// Add a new board member
export const addBoardMember = (memberData) => {
  const members = getAllBoardMembers();
  const newId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
  
  const newMember = {
    id: newId,
    ...memberData,
    profileImageUrl: memberData.profileImageUrl || '/images/placeholder.svg'
  };
  
  console.log('Adding new board member with ID:', newId, newMember);
  members.push(newMember);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  return newMember;
};

// Update an existing board member
export const updateBoardMember = (id, memberData) => {
  console.log('updateBoardMember called with ID:', id, 'Type:', typeof id);
  const members = getAllBoardMembers();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const index = members.findIndex(member => member.id === numericId);
  
  console.log('Found board member at index:', index);
  
  if (index === -1) {
    throw new Error(`Board member not found with ID: ${id}`);
  }
  
  members[index] = {
    ...members[index],
    ...memberData,
    id: numericId // Ensure ID is numeric
  };
  
  console.log('Updated board member:', members[index]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  return members[index];
};

// Delete a board member
export const deleteBoardMember = (id) => {
  const members = getAllBoardMembers();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  const filtered = members.filter(member => member.id !== numericId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Reset to default board members
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOARD_MEMBERS));
  return DEFAULT_BOARD_MEMBERS;
};
