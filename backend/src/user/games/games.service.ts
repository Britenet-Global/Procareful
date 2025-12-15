import { HttpStatus, Injectable } from '@nestjs/common';
import { EDifficultyLevel, EGame, EScoreViewer, TGameEntityType } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { createResponse } from 'src/common/responses/createResponse';
import { TResponse } from 'src/common/types';
import { Between, DataSource, Repository } from 'typeorm';
import { Game2048, Memory, Score, Snake, Sudoku, TicTacToe, WordGuess, Wordle } from './entities';
import { GetScoresDateDto, GetScoresFilterDto } from './dto/get-scores.dto';
import { FilterService } from '../../filter/filter.service';
import { AddGameScoreDto } from './dto';
import { User } from '../entities/user.entity';
import { Admin } from 'src/admin/entities';
import { ERole } from 'src/admin/types';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { TUserGamesResponseKey } from 'src/common/utils/translationKeys';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as dayOfYear from 'dayjs/plugin/dayOfYear';
import { ConfigService } from '@nestjs/config';

dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);

@Injectable()
export class GamesService {
  constructor(
    private dataSource: DataSource,

    private configService: ConfigService,

    private readonly filterService: FilterService,

    private readonly httpService: HttpService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    private readonly i18n: I18nService,
  ) {}

  public gameRepositories = {
    [EGame.GAME_2048]: Game2048,
    [EGame.MEMORY]: Memory,
    [EGame.SNAKE]: Snake,
    [EGame.SUDOKU]: Sudoku,
    [EGame.TIC_TAC_TOE]: TicTacToe,
    [EGame.WORD_GUESS]: WordGuess,
    [EGame.WORDLE]: Wordle,
  };

  async getGameRules(userId: number, gameName: EGame): Promise<TResponse<TGameEntityType>> {
    const lang = I18nContext.current().lang;

    const mlDomain = this.configService.get('mlDomain');
    const oldestScoreDate = await this.getUserOldestScoreDate(userId);
    const url = `${mlDomain}/api/level/user/${userId}/get_level?game=${gameName}${oldestScoreDate ? `&date=${oldestScoreDate.toISOString()}` : ''}`;

    const mlResponse = await lastValueFrom(this.httpService.get(url));
    const { level } = mlResponse.data;

    const gameRepository = this.gameRepositories[gameName];
    const repository = this.dataSource.getRepository(gameRepository);
    const game = await repository.findOne({
      where: {
        difficulty_level: level,
      },
    });

    if (!game) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_not_found.notification.message`, {
          lang,
        }),
      );
    }

    return createResponse(
      HttpStatus.OK,
      game,
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_rules.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_rules.notification.message`, {
        lang,
      }),
    );
  }
  async getDailyGame(
    userId: number,
  ): Promise<TResponse<{ todayGameName: EGame; level: EDifficultyLevel; completed: boolean }>> {
    const oldestScoreDate = await this.getUserOldestScoreDate(userId);
    const now = new Date();
    const timeFromCreated = Math.abs(now.getTime() - oldestScoreDate?.getTime());
    const sixWeeksInMilliseconds = 6 * 7 * 24 * 60 * 60 * 1000;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    let gameName: EGame;
    let level: EDifficultyLevel;
    const mlDomain = this.configService.get('mlDomain');

    if (!oldestScoreDate || timeFromCreated <= sixWeeksInMilliseconds) {
      const url = `${mlDomain}/api/level/user/${userId}/get_level${oldestScoreDate ? `?date=${oldestScoreDate.toISOString()}` : ''}`;
      const response = await lastValueFrom(this.httpService.get(url));
      ({ level, game: gameName } = response.data);
    } else {
      const gameKeys = Object.keys(this.gameRepositories) as EGame[];

      const today = dayjs();
      const dayOfYear = today.dayOfYear();
      const weekNumber = today.week();

      const gameIndex = (dayOfYear + weekNumber) % gameKeys.length;
      gameName = gameKeys[gameIndex];

      const url = `${mlDomain}/api/level/user/${userId}/get_level?game=${gameName}${oldestScoreDate ? `&date=${oldestScoreDate.toISOString()}` : ''}`;
      const response = await lastValueFrom(this.httpService.get(url));
      ({ level } = response.data);
    }

    const gameScore = await this.scoreRepository.findOne({
      where: {
        user: { id: userId },
        game_name: gameName,
        created_at: Between(todayStart, todayEnd),
      },
    });

    const result = {
      todayGameName: gameName,
      level: level,
      completed: !!gameScore,
    };

    return createResponse(HttpStatus.OK, result, `Today's game`, `Today's game fetched`);
  }

  async getGameLevelAndRules(
    userId: number,
    gameName: EGame,
  ): Promise<TResponse<{ gameName: EGame; level: number; rules: TGameEntityType; scoreId: number }>> {
    const lang = I18nContext.current().lang;
    const mlDomain = this.configService.get('mlDomain');

    const oldestScoreDate = await this.getUserOldestScoreDate(userId);
    const url = `${mlDomain}/api/level/user/${userId}/get_level?game=${gameName}${oldestScoreDate ? `&date=${oldestScoreDate.toISOString()}` : ''}`;

    let level: number;

    try {
      const mlResponse = await lastValueFrom(this.httpService.get(url));
      level = mlResponse.data.level;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, error.message);
      }
    }

    const gameRepository = this.gameRepositories[gameName];
    const repository = this.dataSource.getRepository(gameRepository);
    const game = await repository.findOne({
      where: {
        difficulty_level: level,
      },
    });

    if (!game) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const response = {
      gameName,
      level,
      rules: game,
      scoreId: 0,
    };

    delete response.rules.difficulty_level;
    delete response.rules.created_at;
    delete response.rules.id;

    const newScore = new Score();

    Object.assign(newScore, {
      score: 0,
      game_name: gameName,
      game_level: level,
      completion_time: 0,
      completed: false,
      user: userId,
    });

    await this.scoreRepository.save(newScore);

    response.scoreId = newScore.id;

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_rules.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_RULES.game_rules.notification.message`, {
        lang,
      }),
    );
  }

  async getGameScores(
    userId: number,
    seniorId: number,
    gameName: EGame,
    filterDto: GetScoresFilterDto,
    scoresDatesDto: GetScoresDateDto,
    view: EScoreViewer,
  ): Promise<TResponse<Score[]>> {
    const lang = I18nContext.current().lang;
    const loggedInAdmin = await this.adminRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['institution', 'roles'],
    });

    let userQuery;

    const isInsitutionalAdmin = loggedInAdmin.roles.some(
      (role) => role.role_name === ERole.ADMIN_INSTITUTION || role.role_name === ERole.SUPER_ADMIN_INSTITUTION,
    );

    const isAdminCaregiver = loggedInAdmin.roles.some(
      (role) => role.role_name === ERole.FORMAL_CAREGIVER || role.role_name === ERole.INFORMAL_CAREGIVER,
    );

    const isFormalAndInstitutionAdmin = loggedInAdmin.roles.some(
      (role) => role.role_name === ERole.FORMAL_CAREGIVER && ERole.ADMIN_INSTITUTION,
    );

    if (isFormalAndInstitutionAdmin && !view) {
      return createResponse(
        HttpStatus.BAD_REQUEST,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.missing_view_param.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.missing_view_param.notification.message`, {
          lang,
        }),
      );
    }

    if (
      (isFormalAndInstitutionAdmin && view === EScoreViewer.INSTITUTION) ||
      (isInsitutionalAdmin && !isAdminCaregiver)
    ) {
      userQuery = {
        institution: {
          id: loggedInAdmin.institution.id,
        },
      };
    }

    if (
      (isFormalAndInstitutionAdmin && view === EScoreViewer.CAREGIVER) ||
      (isAdminCaregiver && !isInsitutionalAdmin)
    ) {
      userQuery = {
        admins: {
          id: loggedInAdmin.id,
        },
      };
    }

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
        ...userQuery,
      },
    });

    if (!user) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.user_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const queryBuilder = this.scoreRepository
      .createQueryBuilder('scores')
      .leftJoinAndSelect('scores.user', 'user')
      .where('user.id = :seniorId', { seniorId })
      .andWhere('scores.game_name = :gameName', { gameName });

    const { startDate, endDate } = scoresDatesDto;

    if (startDate) {
      queryBuilder.andWhere('scores.created_at >= :startDate', { startDate });
    }
    if (endDate) {
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59, 999);

      const formattedEndDate = endDateWithTime.toISOString();
      queryBuilder.andWhere('scores.created_at <= :endDate', { endDate: formattedEndDate });
    }

    const filteredQueryBuilder = this.filterService.applyFilters(queryBuilder, filterDto);
    const scores = await filteredQueryBuilder.getMany();

    if (!scores) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.scores_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.scores_not_found.notification.message`, {
          lang,
        }),
      );
    }

    return createResponse(
      HttpStatus.OK,
      scores,
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.game_scores.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_SCORES.game_scores.notification.message`, {
        lang,
      }),
    );
  }

  async addGameScore(userId: number, addGameScoreDto: AddGameScoreDto, scoreId: number): Promise<TResponse> {
    const lang = I18nContext.current().lang;
    const { game_name, game_level, completion_time, completed } = addGameScoreDto;

    const senior = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!senior) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.ADD_GAME_SCORE.user_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.ADD_GAME_SCORE.user_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const scores = await this.scoreRepository.findOne({
      where: {
        id: scoreId,
        game_name,
        game_level,
      },
    });

    if (!scores) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.ADD_GAME_SCORE.scores_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(`${TUserGamesResponseKey}.service.ADD_GAME_SCORE.scores_not_found.notification.message`, {
          lang,
        }),
      );
    }

    const updatedScores = {
      game_name,
      completion_time,
      completed,
      ...addGameScoreDto[game_name],
    };

    await this.scoreRepository.update(scoreId, updatedScores);

    return createResponse(
      HttpStatus.OK,
      null,
      this.i18n.t(`${TUserGamesResponseKey}.service.ADD_GAME_SCORE.game_score_added.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserGamesResponseKey}.service.ADD_GAME_SCORE.game_score_added.notification.message`, {
        lang,
      }),
    );
  }

  async getUserOldestScoreDate(seniorId: number): Promise<Date | undefined> {
    const { created_at: oldestUserScore } =
      (await this.scoreRepository.findOne({
        where: {
          user: {
            id: seniorId,
          },
        },
        order: {
          created_at: 'ASC',
        },
      })) || {};

    return oldestUserScore;
  }
}
