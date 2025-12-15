import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto';
import { TResponseDetails } from 'src/common/types';
import { GetUsersActivitiesListDto } from './get-user-activities-list.dto';
import { GetLangDto } from '../../dto/get-lang.dto';

export class AddGameScoreResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Game score added');

  details: TResponseDetails = null;
}

export class GetUserActivitiesListResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('user activities list fetched');

  details: GetUsersActivitiesListDto;
}

export class GetUserLanguagesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('user languages fetched');

  details: GetLangDto;
}
