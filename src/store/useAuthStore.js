import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: { Id: 1, DisplayName: 'Alice', Role: 'Admin' }, // Hardcoded for now
  login: async (userId) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const userData = await res.json();
        set({ user: userData });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  },
  logout: () => set({ user: null })
}));

export default useAuthStore;
