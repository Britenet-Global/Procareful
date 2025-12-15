import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto';
import { TResponseDetails } from 'src/common/types';
import { GetGameFeedbackDisplayOptions, GetPersonalGrowthChallengeDto, UserCompletedActivitiesDto } from '.';
import { GetDashboardDto } from './get-dashboard.dto';
import { GetUserActivityDto } from './get-user-activity.dto';
import { GetTodayGameDto } from '../games/dto/get-today-game.dto';

export class UpdateUserPhysicalActivitiesScoresResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User physical activity scores updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetUserCompletedActivitiesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User completed activities fetched');

  @ApiProperty()
  details: UserCompletedActivitiesDto;
}
export class GetUserActivityResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User activity fetched');

  @ApiProperty()
  details: GetUserActivityDto;
}

export class GetUserDashboardResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User dashboard fetched');

  @ApiProperty()
  details: GetDashboardDto;
}

export class GetTodayGameResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto(`Today's game fetched`);

  @ApiProperty()
  details: GetTodayGameDto;
}

export class GetUserStreakTrophyResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User streak trophy fetched');

  @ApiProperty()
  details: number;
}

export class UpdateUserFeedbackResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User feedback updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class SetPersonalGrowthChallengeToActiveResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Challenge marked as active');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class SetPersonalGrowthChallengeToCompletedResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Challenge marked as completed');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetCompletedPersonalGrowthChallengesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Personal growth challenges fetched');

  @ApiProperty()
  details: GetPersonalGrowthChallengeDto[];
}

export class GetPersonalGrowthChallengeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Personal growth challenge fetched');

  @ApiProperty()
  details: GetPersonalGrowthChallengeDto;
}

export class GetActivePersonalGrowthChallengeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Active personal growth challenge fetched');

  @ApiProperty()
  details: GetPersonalGrowthChallengeDto;
}

export class SkipPersonalGrowthChallengeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Challenge successfully skipped');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class CanSkipChallengeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Challenge successfully skipped');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class AddGameFeedbackResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Game feedback successfully added');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetGameFeedbackDisplayOptionsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Feedback display options fetched');

  @ApiProperty()
  details: GetGameFeedbackDisplayOptions;
}

export class UpdateBrainPointsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Brain points updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetBrainPointsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Brain points fetched');

  @ApiProperty()
  details: number;
}
