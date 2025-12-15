import { RoleDto } from 'src/admin/dto';
import { EStatus } from '../../types';

export class GetInstitutionDto {
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
  status: {
    id: number;
    status_name: EStatus;
  };
  superAdminId: number;
}
export class GetInstitutionAdminsDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth?: Date;
  deleted_at: Date;
  image_name: string;
  first_login: boolean;
  status: {
    id: number;
    status_name: EStatus;
  };
  institution: GetInstitutionDto;
  roles: RoleDto[];
}
