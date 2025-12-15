import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EContactType, ERelationshipToSenior } from '../../types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';
import { AddFamilyDoctorDto } from './family-doctor.dto';

export class GetSupportingContactDto {
  contact: {
    id: number;
    created_at: Date;
    first_name: string;
    last_name: string;
    phone_number: string;
    email_address: string;
    contact_type: EContactType;
    relation: ContactRelation[];
  };
  address: {
    id: number;
    city: string;
    street: string;
    building: string;
    flat: string;
    zip_code: string;
    additional_info?: string;
  };
}
class ContactRelation {
  id: number;
  relations: ERelationshipToSenior;
}

export class AddSupportingContactDto extends AddFamilyDoctorDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'relation' }),
  })
  @IsEnum(ERelationshipToSenior, {
    each: true,
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'relation' }),
  })
  relation: ERelationshipToSenior[];

  @IsBoolean({ message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'address_same_as_senior' }) })
  @IsOptional()
  address_same_as_senior?: boolean;
}
