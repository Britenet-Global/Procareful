import { create } from 'zustand';
import { type LoginData } from '@ProcarefulAdmin/typings';

type UserCredentialsStore = {
  userCredentials: Omit<LoginData, 'password'>;
  setUserCredentials: (userCredentials: Omit<LoginData, 'password'>) => void;
  resetStore: () => void;
};

const initialState = {
  userCredentials: {
    email: '',
  },
};

export const useUserCredentialsStore = create<UserCredentialsStore>(set => ({
  ...initialState,
  setUserCredentials: userCredentials => set({ userCredentials }),
  resetStore: () => set({ ...initialState }),
}));
