import { create } from 'zustand';

type SignUpStore = {
  email: string;
  phoneNumber: string;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  resetSignupStore: () => void;
};

const initialState = {
  email: '',
  phoneNumber: '',
};

export const useSignUpStore = create<SignUpStore>(set => ({
  ...initialState,
  setEmail: email => set({ email }),
  setPhoneNumber: phoneNumber => set({ phoneNumber }),
  resetSignupStore: () => set({ ...initialState }),
}));
