import create from 'zustand';

// Zustand store 생성
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;