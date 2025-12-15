import { AddressDto } from 'src/admin/admin-institution/dto';
import { ERole } from '../../types';

class GetAdminDto {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth?: string;
  first_login: boolean;
  roles: AdminRolesDto[];
}
class AdminRolesDto {
  role_name: ERole;
}

class ExtendedAddressDto extends AddressDto {
  id: number;
}

export class GetMeDto {
  admin: GetAdminDto;
  onboardingCompleted: boolean;
  lang: string;
  address: ExtendedAddressDto;
}
