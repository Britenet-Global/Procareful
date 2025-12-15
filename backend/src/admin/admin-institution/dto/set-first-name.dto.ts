import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class SetMyFirstNameDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'first_name' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'first_name' }),
  })
  first_name: string;
}
