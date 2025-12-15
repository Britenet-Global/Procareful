import { RoleDto } from 'src/admin/dto';
import { EStatus } from 'src/admin/types';

export class GetInstitutionAdminDto {
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
  roles: RoleDto[];
  assignedUsers: boolean;
}
