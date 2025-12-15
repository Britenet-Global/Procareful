import { type z } from 'zod';
import { type addSupportingContactsSchema } from '@ProcarefulAdmin/utils';

export type SupportingContactsData = z.infer<typeof addSupportingContactsSchema>;

export const defaultFormValues: SupportingContactsData = {
  firstName: '',
  lastName: '',
  relation: [],
  phoneNumber: '',
  emailAddress: '',
  addressSameAsSenior: false,
  city: '',
  street: '',
  building: '',
  flat: '',
  zipCode: '',
};

export const MAX_SUPPORTING_CONTACTS_COUNT = 2;
