import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsPhoneNumberValid } from 'src/common/decorators';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class CheckIfInformalCaregiverExistsDto {
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'phone_number' }),
  })
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;
}
