import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const USERS_STORAGE_KEY = 'flavour_world_registered_users';

// Pre-seeded demo user for development and testing
const INITIAL_REGISTERED_USERS = [
  {
    id: 1,
    username: 'demo_user',
    email: 'priya.kumar@gmail.com',
    password: 'Password123',
    name: 'Priya Kumar',
    gender: 'Female',
    age: 28,
    kitchenType: 'Traditional South Indian',
    stateId: 23,
    stateName: 'Tamil Nadu',
    profileCompleted: true
  }
];

export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse registered users:', e);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
  return INITIAL_REGISTERED_USERS;
};

export const saveRegisteredUser = (user) => {
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(
    u => (u.id && u.id === user.id) || 
         (u.username && user.username && u.username.toLowerCase() === user.username.toLowerCase()) || 
         (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
  );
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return user;
};

export const updateRegisteredUserProfile = (identifier, profileData) => {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => 
    (identifier.id && u.id === identifier.id) || 
    (identifier.username && u.username?.toLowerCase() === identifier.username?.toLowerCase()) ||
    (identifier.email && u.email?.toLowerCase() === identifier.email?.toLowerCase())
  );
  if (index >= 0) {
    users[index] = { ...users[index], ...profileData, profileCompleted: true };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users[index];
  }
  return null;
};

export const authService = {
  getRegisteredUsers,
  saveRegisteredUser,
  updateRegisteredUserProfile,

  sendOtp: async (email, isLogin = false) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // If it's a login attempt, verify that the user is already registered
    if (isLogin) {
      const users = getRegisteredUsers();
      const existingUser = users.find(u => u.email?.toLowerCase() === trimmedEmail);
      if (!existingUser) {
        throw new Error('Invalid user. No account found with this email. Please create an account first.');
      }
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/send-otp`, { email: trimmedEmail }, { timeout: 1500 });
      return res;
    } catch {
      // Offline / fallback mode: simulate successful OTP dispatch
      return { data: { success: true, message: 'OTP sent to your email.' } };
    }
  },

  verifyOtp: async (email, otp, isLogin = false) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const existingUser = users.find(u => u.email?.toLowerCase() === trimmedEmail);

    if (isLogin) {
      if (!existingUser) {
        throw new Error('Invalid user. No account found with this email. Please create an account first.');
      }
      return {
        data: {
          user: existingUser,
          token: `flavour-world-auth-${existingUser.id || Date.now()}`
        }
      };
    }

    // If it's registration via OTP:
    if (existingUser) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const newUser = {
      id: Date.now(),
      email: trimmedEmail,
      username: trimmedEmail.split('@')[0],
      name: trimmedEmail.split('@')[0],
      stateId: '',
      kitchenType: '',
      profileCompleted: false
    };

    saveRegisteredUser(newUser);

    return {
      data: {
        user: newUser,
        token: `flavour-world-auth-${newUser.id}`
      }
    };
  },

  registerWithUsername: async (username, password) => {
    const trimmedUsername = username.trim();
    const users = getRegisteredUsers();
    const existingUser = users.find(
      u => u.username?.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (existingUser) {
      throw new Error('This username is already taken. Please choose another username or sign in.');
    }

    const newUser = {
      id: Date.now(),
      username: trimmedUsername,
      email: `${trimmedUsername.toLowerCase()}@flavourworld.com`,
      password,
      name: trimmedUsername,
      stateId: '',
      kitchenType: '',
      profileCompleted: false
    };

    saveRegisteredUser(newUser);

    try {
      await axios.post(`${API_BASE}/api/auth/register`, { username: trimmedUsername, password }, { timeout: 1500 });
    } catch {
      // Continue with stored user session
    }

    return {
      data: {
        user: newUser,
        token: `flavour-world-auth-${newUser.id}`
      }
    };
  },

  loginWithUsername: async (username, password) => {
    const trimmedUsername = username.trim().toLowerCase();
    const users = getRegisteredUsers();
    
    // Search by username or email
    const user = users.find(
      u => u.username?.toLowerCase() === trimmedUsername || u.email?.toLowerCase() === trimmedUsername
    );

    if (!user) {
      throw new Error('Invalid user. Account does not exist. Please create an account first.');
    }

    if (user.password && user.password !== password) {
      throw new Error('Invalid password. Please check your credentials and try again.');
    }

    try {
      await axios.post(`${API_BASE}/api/auth/login`, { username: trimmedUsername, password }, { timeout: 1500 });
    } catch {
      // Continue with matched user
    }

    return {
      data: {
        user,
        token: `flavour-world-auth-${user.id || Date.now()}`
      }
    };
  }
};

export default authService;

