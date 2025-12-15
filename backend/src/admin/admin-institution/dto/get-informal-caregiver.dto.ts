import { UserDto } from 'src/common/dto/user.dto';
import { GetInstitutionDto } from './get-institution.dto';
import { AddressDto } from './address.dto';
import { AdminBasicInfo } from './get-admin-basic-info.dto';
import { NestedPagination } from '../../../common/dto';

export class GetInformalCaregiverDto {
  informalCaregiver: InformalCaregiver;
  address: AddressDto;
}
export class InformalCaregiver extends AdminBasicInfo {
  users: { items: UserDto[]; pagination: NestedPagination };
}
export class GetInformalCaregiversDto extends AdminBasicInfo {
  institution: GetInstitutionDto;
}

export class AddInformalCaregiverResDto {
  id: number;
}
