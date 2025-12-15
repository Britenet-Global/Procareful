import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { TValidationKey } from 'src/common/utils/translationKeys';

export class GetDocumentsFilterDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'pageSize' }),
  })
  @Min(1, { message: i18nValidationMessage(`${TValidationKey}.PAGE_SIZE_MIN`) })
  pageSize?: number = 10;

  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage(`${TValidationKey}.NUMBER`, { property: 'page' }),
  })
  page?: number = 1;

  @IsOptional()
  search?: string;
}
