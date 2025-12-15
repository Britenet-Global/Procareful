import { IsEmail, IsNotEmpty, IsEnum, ValidateNested, IsOptional, ValidateIf } from 'class-validator';
import { EWeekdays } from '../../../common/types';
import { Type } from 'class-transformer';
import { IsPhoneNumberValid } from '../../../common/decorators';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class DayDto {
  @IsEnum(EWeekdays, { message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'name' }) })
  name: EWeekdays;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'start' }),
  })
  start: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'end' }),
  })
  end: string;
}
export class WorkingHoursDto {
  @ValidateIf((o) => o.phone !== '')
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  @IsOptional()
  phone?: string;

  @ValidateIf((o) => o.email !== '')
  @IsEmail({}, { message: `${TValidationKey}.EMAIL` })
  @IsOptional()
  email?: string;

  @ValidateNested({ each: true })
  @Type(() => DayDto)
  days?: DayDto[];
}
