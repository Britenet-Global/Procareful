import { IsNotEmpty, IsDateString } from 'class-validator';

export class DateRangeDto {
  @IsNotEmpty()
  @IsDateString({ strict: true })
  startDate: string;

  @IsNotEmpty()
  @IsDateString({ strict: true })
  endDate: string;
}
