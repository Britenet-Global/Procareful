import { create } from 'zustand';

type UserAuthState = { isAuth: boolean; isLoading: boolean };

type UserAuthStore = {
  phoneNumber: string;
  email: string;
  authState: UserAuthState;
  setUserEmail: (email: string) => void;
  setUserPhoneNumber: (phoneNumber: string) => void;
  setAuthState: (authState: UserAuthState) => void;
};

const initialState = {
  phoneNumber: '',
  email: '',
  authState: { isAuth: false, isLoading: true },
};

export const useAuthStore = create<UserAuthStore>(set => ({
  ...initialState,
  setUserEmail: email => set({ email }),
  setUserPhoneNumber: phoneNumber => set({ phoneNumber }),
  setAuthState: authState => set({ authState }),
}));
