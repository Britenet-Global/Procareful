import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ENoteCategory } from 'src/notes/types';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class UpdateNoteDto {
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'title' }),
  })
  title: string;

  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'note' }),
  })
  note: string;

  @IsOptional()
  @IsEnum(ENoteCategory, {
    each: true,
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'category' }),
  })
  category?: ENoteCategory[];

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'priority' }),
  })
  priority?: boolean;
}
