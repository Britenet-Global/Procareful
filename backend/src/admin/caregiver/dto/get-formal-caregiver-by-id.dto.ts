import { AddressDto, WorkingHoursDto } from '../../admin-institution/dto';
import { CaregiverRoleDto } from '../../dto/caregiver_role.dto';

class FormalCaregiverByIdDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth?: string;
  deleted_at: Date;
  image_name: string;
  caregiver_roles: CaregiverRoleDto[];
  workingHours: WorkingHoursDto;
  avatar: string | null;
}

export class GetFormalCaregiverByIdDto {
  formalCaregiver: FormalCaregiverByIdDto;
  address: AddressDto;
}
