import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto';
import { GetGamesEngagementDto } from './get-games-engagement.dto';

export class GetGamesEngagementResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Cognitive games engagement data retrieved successfully');

  @ApiProperty()
  details: GetGamesEngagementDto;
}
