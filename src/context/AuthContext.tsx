import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  _id: string;
  id?: string; // For compatibility with orders
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    _id: 'user1',
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Hyderabad, Telangana',
    dateOfBirth: '1990-05-15',
    role: 'user',
    createdAt: '2024-01-15T10:30:00Z',
    password: 'password123'
  },
  {
    _id: 'admin1',
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@spicepalace.com',
    phone: '+91 87654 32109',
    address: 'Spice Palace Restaurant, Banjara Hills, Hyderabad',
    role: 'admin',
    createdAt: '2023-12-01T08:00:00Z',
    password: 'admin123'
  }
];

export default function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('spice_palace_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('spice_palace_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // First, check if user exists in our system
    const existingUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (existingUser) {
      // Existing user login
      const { password: _, ...userWithoutPassword } = existingUser;
      localStorage.setItem('spice_palace_user', JSON.stringify(userWithoutPassword));
      setState({
        user: userWithoutPassword,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    } else {
      // Check if email exists but password is wrong
      const userWithEmail = mockUsers.find(u => u.email === email);
      if (userWithEmail) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false; // Wrong password
      } else {
        // Email doesn't exist - create a new user automatically (guest registration)
        const newUser: User = {
          _id: `user_${Date.now()}`,
          id: `user_${Date.now()}`,
          name: email.split('@')[0], // Use email prefix as name
          email,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        // Add to mock users
        mockUsers.push({ ...newUser, password });
        
        localStorage.setItem('spice_palace_user', JSON.stringify(newUser));
        setState({
          user: newUser,
          isLoading: false,
          isAuthenticated: true,
        });
        return true;
      }
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
    
    // Create new user
    const newUser: User = {
      _id: `user_${Date.now()}`,
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock users (in real app, this would be saved to database)
    mockUsers.push({ ...newUser, password });
    
    localStorage.setItem('spice_palace_user', JSON.stringify(newUser));
    setState({
      user: newUser,
      isLoading: false,
      isAuthenticated: true,
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('spice_palace_user');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('spice_palace_user', JSON.stringify(updatedUser));
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}