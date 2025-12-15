import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto/api-response.dto';
import { TResponseDetails } from 'src/common/types';

export class LoginResponseDto {
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('You are logged in.');

  details: TResponseDetails = null;
}
export class GeneratePinResponseDto {
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Pin code was sent.');

  details: TResponseDetails = null;
}
export class LogoutResponseDto {
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Logged out successfully');

  details: TResponseDetails = null;
}
