import { create } from 'zustand';

interface IUser {
  id: string;
  name: string;
}

interface IUserStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const userStore = create<IUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default userStore;