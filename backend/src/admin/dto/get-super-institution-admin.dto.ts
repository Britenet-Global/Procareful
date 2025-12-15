import { RoleDto } from '.';
import { EStatus } from '../types';

export class GetSuperInstitutionAdminDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth?: string;
  status: {
    id: number;
    status_name: EStatus;
  };
  institution: {
    id: number;
    created_at: Date;
    name: string;
    city?: string;
    street?: string;
    building?: string;
    flat?: string;
    zip_code?: string;
    phone?: string;
    email?: string;
  };
  roles: RoleDto[];
}
