import { create } from 'zustand';

type UserCredentialsStore = {
  isOnboardingSuccessModalOpen: boolean;
  setOnboardingSuccessModalVisibility: (isModalVisible: boolean) => void;
};

const initialState = {
  isOnboardingSuccessModalOpen: false,
};

export const useOnboardingStore = create<UserCredentialsStore>(set => ({
  ...initialState,
  setOnboardingSuccessModalVisibility: isModalVisible =>
    set({ isOnboardingSuccessModalOpen: isModalVisible }),
}));
