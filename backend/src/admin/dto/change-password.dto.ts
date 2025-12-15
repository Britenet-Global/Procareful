import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsPasswordValid } from 'src/common/decorators';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class ChangePasswordDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'currentPassword' }),
  })
  currentPassword: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'newPassword' }),
  })
  @IsPasswordValid({ message: `${TValidationKey}.AUTH_PASSWORD` })
  newPassword: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'confirmNewPassword' }),
  })
  @IsPasswordValid({ message: `${TValidationKey}.AUTH_PASSWORD` })
  confirmNewPassword: string;
}
