import { AdminWithoutStatus, AdminWithoutStatusAndRoles } from '../../admin-institution/dto/get-admin-basic-info.dto';
import { CaregiverRoleDto, RoleDto } from '../../dto';
import { Status } from '../../admin-institution/dto';
import { NestedPagination } from '../../../common/dto';
import { EUserPhysicalActivityGroup } from '../types';

class GetCaregiverDto extends AdminWithoutStatusAndRoles {
  roles: RoleDto[];
  caregiver_roles: CaregiverRoleDto[];
}
export class GetUserInfoDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  phone_number: string;
  email_address: string;
  image_name: string;
  created_by: AdminWithoutStatusAndRoles;
  caregivers: { items: GetCaregiverDto[]; pagination: NestedPagination };
  address: {
    id: number;
    city: string;
    street: string;
    building: string;
    flat: string;
    zip_code: string;
    additional_info?: string;
  };
  image: string | null;
  assessment_completed: boolean;
  activities_assigned: boolean | null;
  performance_warning: boolean | null;
  activity_group: EUserPhysicalActivityGroup;
}
export class GetUsersForCaregiverDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  phone_number: string;
  email_address: string;
  image_name: string;
  admins: AdminWithoutStatus[];
}

export class GetUsersForCaregiverWithImageDto extends GetUsersForCaregiverDto {
  image: string;
  assessment_completed: boolean;
  activities_assigned: boolean;
  performance_warning: boolean | null;
  status: Status;
}
