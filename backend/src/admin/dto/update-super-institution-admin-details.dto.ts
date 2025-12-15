import { IsEmail, IsString, IsOptional, Length, IsIn } from 'class-validator';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { TValidationKey } from '../../common/utils/translationKeys';
import { ERole } from '../types';

export class UpdateSuperInstitutionAdminDetailsDto {
  @IsOptional()
  @IsEmail()
  email_address: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;
}

export class UpdateInstitutionNameDto {
  @IsOptional()
  @IsString()
  @Length(5, 100)
  name: string;
}

export class UpdateInstitutionAdminRoleDto {
  @IsOptional()
  @IsIn([ERole.FORMAL_CAREGIVER, ERole.ADMIN_INSTITUTION])
  roleToAssign?: ERole;

  @IsOptional()
  @IsIn([ERole.FORMAL_CAREGIVER, ERole.ADMIN_INSTITUTION])
  roleToRemove?: ERole;
}
