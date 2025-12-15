import { EContactType } from 'src/admin/types';

export class GetEmergencyContactsDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  legal_representative: boolean;
  contact_type: EContactType;
}
