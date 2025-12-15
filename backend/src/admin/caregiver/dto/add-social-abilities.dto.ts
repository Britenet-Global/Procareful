import { IsNotEmpty, IsEnum } from 'class-validator';
import { ESocialAbilitiesResponseType } from '../types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class AddSocialAbilitiesDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'experience_of_emptiness' }),
  })
  @IsEnum(ESocialAbilitiesResponseType, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'experience_of_emptiness' }),
  })
  experience_of_emptiness: ESocialAbilitiesResponseType;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'miss_having_people_around' }),
  })
  @IsEnum(ESocialAbilitiesResponseType, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'miss_having_people_around' }),
  })
  miss_having_people_around: ESocialAbilitiesResponseType;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'feel_rejected' }),
  })
  @IsEnum(ESocialAbilitiesResponseType, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'feel_rejected' }),
  })
  feel_rejected: ESocialAbilitiesResponseType;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'rely_on_people' }),
  })
  @IsEnum(ESocialAbilitiesResponseType, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'rely_on_people' }),
  })
  rely_on_people: ESocialAbilitiesResponseType;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'trust_completely' }),
  })
  @IsEnum(ESocialAbilitiesResponseType, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'trust_completely' }),
  })
  trust_completely: ESocialAbilitiesResponseType;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'enough_people_feel_close' }),
  })
  @IsEnum(ESocialAbilitiesResponseType, {
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'enough_people_feel_close' }),
  })
  enough_people_feel_close: ESocialAbilitiesResponseType;
}
