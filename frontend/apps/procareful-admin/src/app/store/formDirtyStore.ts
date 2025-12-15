import { create } from 'zustand';

type FormId =
  | 'institutionDetails'
  | 'workingHours'
  | 'seniorBasicInfo'
  | 'seniorUserContactInfo'
  | 'roleForm'
  | 'personalInfo'
  | 'changePassword';

type FormDirtyStore = {
  dirtyForms: Partial<Record<FormId, boolean>>;
  setDirty: (formId: FormId, dirty: boolean) => void;
  isDirty: () => boolean;
};

const initialState = {
  dirtyForms: {},
};

const useFormDirtyStore = create<FormDirtyStore>((set, get) => ({
  ...initialState,
  setDirty: (formId, dirty) =>
    set(({ dirtyForms }) => ({
      dirtyForms: { ...dirtyForms, [formId]: dirty },
    })),
  isDirty: () => Object.values(get().dirtyForms).some(dirty => dirty),
}));

export default useFormDirtyStore;
