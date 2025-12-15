import { CaregiverRoleDto } from '../../dto/caregiver_role.dto';
import { NestedPagination, UserDto } from '../../../common/dto';
import { GetInstitutionDto } from './get-institution.dto';
import { AdminBasicInfo, AdminWithoutStatus } from './get-admin-basic-info.dto';
import { AddressDto } from './address.dto';

class UserWithAdminsDto extends UserDto {
  admins: AdminWithoutStatus[];
}

export class FormalCaregiverDto extends AdminBasicInfo {
  caregiver_roles: CaregiverRoleDto[];
  users: { items: UserWithAdminsDto[]; pagination: NestedPagination };
  institution: GetInstitutionDto;
}

export class GetFormalCaregiversDto extends AdminBasicInfo {
  caregiver_roles: CaregiverRoleDto[];
  institution: GetInstitutionDto;
}
export class GetFormalCaregiverDto {
  formalCaregiver: FormalCaregiverDto;
  address: AddressDto;
}
