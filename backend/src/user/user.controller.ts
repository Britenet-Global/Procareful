import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import { TResponse, TUserReq } from 'src/common/types';
import { IsAuthenticated } from './auth/guard/check.authentication.guard';
import {
  AddGameFeedbackAfterSecondLoss,
  AddGameFeedbackClosingGameBeforeCompletion,
  AddGameFeedbackIncreasedDifficultyLevel,
  AddGameFeedbackResponseDto,
  CanSkipChallengeResponseDto,
  GetActivePersonalGrowthChallengeResponseDto,
  GetBrainPointsResponseDto,
  GetCompletedPersonalGrowthChallengesResponseDto,
  GetGameFeedbackDisplayOptionsResponseDto,
  GetPersonalGrowthChallengeResponseDto,
  GetTodayGameResponseDto,
  GetUserActivitiesListDto,
  GetUserActivityResponseDto,
  GetUserCompletedActivitiesResponseDto,
  GetUserDashboardResponseDto,
  GetUserStreakTrophyResponseDto,
  SetPersonalGrowthChallengeToActiveResponseDto,
  SetPersonalGrowthChallengeToCompletedResponseDto,
  SkipPersonalGrowthChallengeResponseDto,
  UpdateBrainPoints,
  UpdateBrainPointsResponseDto,
  UpdateUserFeedbackDto,
  UpdateUserFeedbackResponseDto,
  UpdateUserPhysicalActivitiesScoresDto,
  UpdateUserPhysicalActivitiesScoresResponseDto,
  userGameRulesResponseDto,
} from './dto';
import { UserService } from './user.service';
import { BadRequestDto, NotificationDto } from '../common/dto';
import { EGame } from './games/types';
import { GameValidationPipe } from './games/validations/gameValidationPipe';
import { GamesService } from './games/games.service';
import {
  AddGameScoreDto,
  AddGameScoreResponseDto,
  GetUserActivitiesListResponseDto,
  GetUserLanguagesResponseDto,
} from './games/dto';
import { GameScoreValidationPipe } from './games/validations/gameScoreValidationPipe';
import { EBreathingExerciseType, EPhysicalExercises, EWalkingExercises } from '../admin/caregiver/types';
import { ExerciseValidationPipe } from './games/validations/exerciseValidationPipe';

@Controller('')
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
@UseGuards(IsAuthenticated)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly gamesService: GamesService,
  ) {}

  @Patch('activities/physical/scores')
  @ApiOkResponse({
    description: 'OK',
    type: UpdateUserPhysicalActivitiesScoresResponseDto,
  })
  async updateUserPhysicalActivitiesScores(
    @Body() dto: UpdateUserPhysicalActivitiesScoresDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.updateUserPhysicalActivitiesScores(userId, dto);
    return res.status(result.status).send(result);
  }

  @Get('dashboard')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserDashboardResponseDto,
  })
  async getDashboard(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.userService.getDashboard(userId);
    return res.status(result.status).send(result);
  }

  @Get('games/today-game')
  @ApiOkResponse({
    description: 'OK',
    type: GetTodayGameResponseDto,
  })
  async getGameDashboard(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.gamesService.getDailyGame(userId);
    return res.status(result.status).send(result);
  }

  @Get('activities')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserActivityResponseDto,
  })
  async getUserActivity(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Query('exercise', ExerciseValidationPipe)
    exercise: EWalkingExercises | EPhysicalExercises | EBreathingExerciseType,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getUserActivity(userId, exercise);
    return res.status(result.status).send(result);
  }

  @Get('trophy')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserStreakTrophyResponseDto,
  })
  async getDayStreakTrophy(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.userService.getDayStreakTrophy(userId);
    return res.status(result.status).send(result);
  }

  @Get('activities/completed')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserCompletedActivitiesResponseDto,
  })
  async getUserCompletedActivities(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getUserCompletedActivities(userId);
    return res.status(result.status).send(result);
  }

  @Patch('personal-growth/:personalGrowthId/feedback')
  @ApiOkResponse({
    description: 'OK',
    type: UpdateUserFeedbackResponseDto,
  })
  async updateUserFeedback(
    @Param('personalGrowthId') personalGrowthId: number,
    @Body() updateUserFeedbackDto: UpdateUserFeedbackDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.updateUserFeedback(userId, personalGrowthId, updateUserFeedbackDto);
    return res.status(result.status).send(result);
  }

  @Put('personal-growth/:personalGrowthId/active')
  @ApiOkResponse({
    description: 'OK',
    type: SetPersonalGrowthChallengeToActiveResponseDto,
  })
  async setPersonalGrowthChallengeToActive(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('personalGrowthId', ParseIntPipe) personalGrowthId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.setPersonalGrowthChallengeToActive(userId, personalGrowthId);
    return res.status(result.status).send(result);
  }

  @Put('personal-growth/:personalGrowthId/completed')
  @ApiOkResponse({
    description: 'OK',
    type: SetPersonalGrowthChallengeToCompletedResponseDto,
  })
  async setPersonalGrowthChallengeToCompleted(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('personalGrowthId', ParseIntPipe) personalGrowthId: number,
    @Body() updateUserFeedbackDto: UpdateUserFeedbackDto,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.setPersonalGrowthChallengeToCompleted(
      userId,
      personalGrowthId,
      updateUserFeedbackDto,
    );
    return res.status(result.status).send(result);
  }

  @Get('personal-growth/completed')
  @ApiOkResponse({
    description: 'OK',
    type: GetCompletedPersonalGrowthChallengesResponseDto,
  })
  async getCompletedPersonalGrowthChallenges(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getCompletedPersonalGrowthChallenges(userId);
    return res.status(result.status).send(result);
  }

  @Patch('personal-growth/:personalGrowthId/skip')
  @ApiOkResponse({
    description: 'OK',
    type: SkipPersonalGrowthChallengeResponseDto,
  })
  async skipChallenge(
    @Param('personalGrowthId') personalGrowthId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.skipChallenge(userId, personalGrowthId);
    return res.status(result.status).send(result);
  }

  @Get('personal-growth/active')
  @ApiOkResponse({
    description: 'OK',
    type: GetActivePersonalGrowthChallengeResponseDto,
  })
  async getActivePersonalGrowthChallenge(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getActivePersonalGrowthChallenge(userId);
    return res.status(result.status).send(result);
  }

  @Get('personal-growth/:personalGrowthId')
  @ApiOkResponse({
    description: 'OK',
    type: GetPersonalGrowthChallengeResponseDto,
  })
  async getPersonalGrowthChallenge(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('personalGrowthId', ParseIntPipe) personalGrowthId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getPersonalGrowthChallenge(userId, personalGrowthId);
    return res.status(result.status).send(result);
  }

  @Get('personal-growth/challenges/can-skip')
  @ApiOkResponse({
    description: 'OK',
    type: CanSkipChallengeResponseDto,
  })
  async canSkipChallenge(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.userService.canSkipChallenge(userId);
    return res.status(result.status).send(result);
  }

  @Post('games/feedback/increased_difficulty_level')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddGameFeedbackResponseDto,
  })
  async addGameFeedbackIncreasedDifficultyLevel(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Body() dto: AddGameFeedbackIncreasedDifficultyLevel,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.addGameFeedbackIncreasedDifficultyLevel(userId, dto);
    return res.status(result.status).send(result);
  }

  @Post('games/feedback/closing_game_before_completion')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddGameFeedbackResponseDto,
  })
  async addGameFeedbackClosingGameBeforeCompletion(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Body() dto: AddGameFeedbackClosingGameBeforeCompletion,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.addGameFeedbackClosingGameBeforeCompletion(userId, dto);
    return res.status(result.status).send(result);
  }

  @Post('games/feedback/second-loss')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddGameFeedbackResponseDto,
  })
  async addGameFeedbackAfterSecondLoss(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Body() dto: AddGameFeedbackAfterSecondLoss,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.addGameFeedbackAfterSecondLoss(userId, dto);
    return res.status(result.status).send(result);
  }

  @Get('games/feedback/display-options')
  @ApiOkResponse({
    description: 'OK',
    type: GetGameFeedbackDisplayOptionsResponseDto,
  })
  async getGameFeedbackDisplayOptions(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Query('game_name', GameValidationPipe) game_name: EGame,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getGameFeedbackDisplayOptions(userId, game_name);
    return res.status(result.status).send(result);
  }

  @Put('games/brain-points')
  @ApiOkResponse({
    description: 'OK',
    type: UpdateBrainPointsResponseDto,
  })
  async updateBrainPoints(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Body() dto: UpdateBrainPoints,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.updateBrainPoints(userId, dto);
    return res.status(result.status).send(result);
  }

  @Get('games/brain-points')
  @ApiOkResponse({
    description: 'OK',
    type: GetBrainPointsResponseDto,
  })
  async getBrainPoints(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.userService.getBrainPoints(userId);
    return res.status(result.status).send(result);
  }

  @Get('games/:gameName')
  @ApiExtraModels(...userGameRulesResponseDto)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', default: 200 },
        notification: { $ref: getSchemaPath(NotificationDto) },
        details: {
          properties: {
            gameName: { type: 'string', enum: Object.values(EGame) },
            level: { type: 'number', default: 1 },
            rules: {
              type: 'object',
              oneOf: userGameRulesResponseDto.map((dto) => ({
                $ref: getSchemaPath(dto),
              })),
            },
            scoreId: { type: 'number' },
          },
        },
      },
    },
  })
  async getGameLevelAndRules(
    @Param('gameName', GameValidationPipe) gameName: EGame,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.gamesService.getGameLevelAndRules(userId, gameName);
    return res.status(result.status).send(result);
  }

  @Patch('games/scores/:scoreId')
  @ApiOkResponse({
    description: 'OK',
    type: AddGameScoreResponseDto,
  })
  async addGameScore(
    @Param('scoreId') scoreId: number,
    @Body(new GameScoreValidationPipe()) addGameScoreDto: AddGameScoreDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.gamesService.addGameScore(userId, addGameScoreDto, scoreId);
    return res.status(result.status).send(result);
  }

  @Get('activities/list')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserActivitiesListResponseDto,
  })
  async getUserActivitiesList(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Query() dto: GetUserActivitiesListDto,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.getUserActivitiesList(userId, dto);
    return res.status(result.status).send(result);
  }

  @Get('lang')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserLanguagesResponseDto,
  })
  async getLanguage(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.userService.getLang(userId);
    return res.status(result.status).send(result);
  }

  @Put('date')
  async updateUserDate(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Body('date') date: string,
  ): Promise<Response<TResponse>> {
    const result = await this.userService.updateUserDate(userId, date);
    return res.status(result.status).send(result);
  }
}
