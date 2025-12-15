import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { TValidationKey } from '../../../common/utils/translationKeys';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerificationCodeDto {
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'code' }),
  })
  code: string;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'rememberMe' }),
  })
  rememberMe?: boolean;
}
