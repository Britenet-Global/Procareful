import { IsInt } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class AddCognitiveAbilitiesDto {
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'moca_scoring' }),
  })
  moca_scoring: number;
}
