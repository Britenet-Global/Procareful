import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto';
import { GetUserScheduleDto } from '.';

export class GetUserScheduleResponse {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User schedule fetched.');

  @ApiProperty()
  details: GetUserScheduleDto;
}
