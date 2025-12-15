import { ENoteCategory } from '../../../notes/types';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from '../../../common/utils/translationKeys';

export class GetNoteAuthorDto {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth: Date;
  deleted_at: Date;
  image_name: string;
}
export class GetNoteCategoryDto {
  id: number;
  category_name: ENoteCategory;
}
export class GetNoteAttachmentsDto {
  id: number;
  name: string;
}
export class GetNoteWithoutAttachmentDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  note: string;
  priority: boolean;
  category: GetNoteCategoryDto[];
}
export class GetNotesDto extends GetNoteWithoutAttachmentDto {
  attachments: GetNoteAttachmentsDto[];
  author: GetNoteAuthorDto;
}
export class GetNoteWithFlagDto extends GetNotesDto {
  editable: boolean;
}
export class AddNoteDto {
  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'title' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'title' }),
  })
  title: string;

  @IsNotEmpty({
    message: i18nValidationMessage(`${TValidationKey}.NOT_EMPTY`, { property: 'note' }),
  })
  @IsString({
    message: i18nValidationMessage(`${TValidationKey}.STRING`, { property: 'note' }),
  })
  note: string;

  @IsOptional()
  @IsBoolean({
    message: i18nValidationMessage(`${TValidationKey}.BOOLEAN`, { property: 'priority' }),
  })
  priority: boolean;

  @IsOptional()
  @IsEnum(ENoteCategory, {
    each: true,
    message: i18nValidationMessage(`${TValidationKey}.ENUM`, { property: 'category' }),
  })
  category?: ENoteCategory[];
}
