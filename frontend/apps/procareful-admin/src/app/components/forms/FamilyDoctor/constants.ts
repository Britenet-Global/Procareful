import { type z } from 'zod';
import { type familyDoctorSchema } from '@ProcarefulAdmin/utils';

export type FamilyDoctorData = z.infer<typeof familyDoctorSchema>;

export const defaultFormValues: FamilyDoctorData = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  city: '',
  street: '',
  building: '',
  flat: '',
  zipCode: '',
};
