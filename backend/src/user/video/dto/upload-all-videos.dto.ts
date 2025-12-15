import { IsString } from 'class-validator';

export class UploadAllVideosDto {
  @IsString()
  sourceFolder: string;
}
