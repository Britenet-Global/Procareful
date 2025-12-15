import { EStatus } from '../../types';
import { AdminWithoutStatusAndRoles } from './get-admin-basic-info.dto';
import { CaregiverRoleDto, RoleDto } from '../../dto';
import { NestedPagination } from '../../../common/dto';

class AdminPartial {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth: Date;
  roles: RoleDto[];
  caregiver_roles: CaregiverRoleDto[];
}

export class GetUserDto {
  senior: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    phone_number: string;
    email_address: string;
    admins: { items: AdminPartial[]; pagination: NestedPagination };
    created_by: AdminWithoutStatusAndRoles;
    status: {
      id: number;
      status_name: EStatus;
    };
  };
  address: {
    id: number;
    street: string;
    building: string;
    flat: string;
    zip_code: string;
    city: string;
    additional_info?: string;
  };
}
