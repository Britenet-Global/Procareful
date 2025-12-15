import { IsInt, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class EditSeniorsFormalCaregiverDto {
  @IsNotEmpty()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'newFormalCaregiverId' }),
  })
  newFormalCaregiverId: number;
}
