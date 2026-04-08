import { create } from 'zustand';

export type UserRole = 'student' | 'staff' | 'admin';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => string | null;
  logout: () => void;
}

const demoUsers: Record<UserRole, AuthUser> = {
  student: { id: 'M001', name: 'Alice Johnson', email: 'alice@university.edu', role: 'student' },
  staff: { id: 'M002', name: 'Dr. Robert Smith', email: 'rsmith@university.edu', role: 'staff' },
  admin: { id: 'ADM01', name: 'Librarian Admin', email: 'admin@university.edu', role: 'admin' },
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (email, password, role) => {
    // Mock auth — any non-empty password works
    if (!email || !password) return 'Please fill in all fields';
    const user = { ...demoUsers[role], email };
    set({ user, isAuthenticated: true });
    return null;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
