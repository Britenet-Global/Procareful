import { EStatus } from '../../types';
import { AdminWithoutStatusAndRoles } from './get-admin-basic-info.dto';

export class InstitutionPartial {
  id: number;
  created_at: Date;
  name: string;
  city: string;
  street: string;
  building: string;
  flat: string;
  zip_code: string;
  phone: string;
  email: string;
}

export class Status {
  id: number;
  status_name: EStatus;
}

export class GetUsersDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  phone_number: string;
  email_address: string;
  institution: InstitutionPartial;
  created_by: AdminWithoutStatusAndRoles;
  status: Status;
}
