import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from '../../common/dto';
import { GetNotificationSettingsDto } from './notification-settings.dto';
import { TResponseDetails } from '../../common/types';

export class GetNotificationSettingsResponseDto {
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Notification settings fetched successfully');

  details: GetNotificationSettingsDto;
}
export class PatchNotificationSettingsResponseDto {
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Notification settings updated successfully');

  details: TResponseDetails = null;
}

export class MarkNotificationAsADisplayedResponseDto {
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Notifications marked as displayed');

  details: TResponseDetails = null;
}

export class GetUnreadNotificationCountResponseDto {
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Unread notification count fetched');

  details: number;
}
export class GetQrCodeResponseDto {
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('QR code fetched successfully');

  details: string;
}
