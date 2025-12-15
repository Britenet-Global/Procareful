import { ApiProperty } from '@nestjs/swagger';
import { ENotificationTitle } from '../types';

export class TEventDataDto {
  @ApiProperty()
  adminId: number;

  @ApiProperty()
  title: ENotificationTitle;
}
