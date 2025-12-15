import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Admin } from 'src/admin/entities';
import { NestedPaginatedResponseDto } from 'src/common/dto';
import { NestedPaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { Address } from 'src/common/entities/address.entity';
import { createPaginatedResponse } from 'src/common/responses/createPaginatedResponse';
import { createResponse } from 'src/common/responses/createResponse';
import { TResponse, EInitiationPeriod } from 'src/common/types';
import { TMLResponseKey, TUserGamesResponseKey } from 'src/common/utils/translationKeys';
import { FilterService } from 'src/filter/filter.service';
import { User } from 'src/user/entities/user.entity';
import { GetScoresFilterDto } from 'src/user/games/dto/get-scores.dto';
import { Score } from 'src/user/games/entities';
import { GamesService } from 'src/user/games/games.service';
import { EDifficultyLevel, EGame } from 'src/user/games/types';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MlService {
  constructor(
    private readonly gamesService: GamesService,

    private readonly filterService: FilterService,

    private dataSource: DataSource,

    private readonly i18n: I18nService,

    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async getGameDifficultyLevels(gameName: EGame): Promise<TResponse<EDifficultyLevel[]>> {
    const lang = I18nContext.current().lang;
    const gameRepository = this.gamesService.gameRepositories[gameName];
    const repository = this.dataSource.getRepository(gameRepository);
    const games = await repository.find({
      select: ['difficulty_level'],
    });

    if (!games) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(`${TUserGamesResponseKey}.service.GET_GAME_DIFFICULTY_LEVELS.games_not_found.notification.title`, {
          lang,
        }),
        this.i18n.t(
          `${TUserGamesResponseKey}.service.GET_GAME_DIFFICULTY_LEVELS.games_not_found.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    const difficultyLevels = games.map((game) => game.difficulty_level);

    return createResponse(
      HttpStatus.OK,
      difficultyLevels,
      this.i18n.t(
        `${TUserGamesResponseKey}.service.GET_GAME_DIFFICULTY_LEVELS.game_difficulty_levels.notification.title`,
        {
          lang,
        },
      ),
      this.i18n.t(
        `${TUserGamesResponseKey}.service.GET_GAME_DIFFICULTY_LEVELS.game_difficulty_levels.notification.message`,
        {
          lang,
          args: { property: gameName },
        },
      ),
    );
  }

  async getRecentGameScore(seniorId: number, gameName: EGame): Promise<TResponse<Score>> {
    const lang = I18nContext.current().lang;
    const recentScore = await this.scoreRepository.findOne({
      where: {
        user: {
          id: seniorId,
        },
        game_name: gameName,
      },
      order: { created_at: 'DESC' },
    });

    if (!recentScore) {
      return createResponse(
        HttpStatus.NOT_FOUND,
        null,
        this.i18n.t(
          `${TUserGamesResponseKey}.service.GET_RECENT_GAME_SCORE.not_found_recent_scores.notification.title`,
          {
            lang,
          },
        ),
        this.i18n.t(
          `${TUserGamesResponseKey}.service.GET_RECENT_GAME_SCORE.not_found_recent_scores.notification.message`,
          {
            lang,
          },
        ),
      );
    }

    return createResponse(
      HttpStatus.OK,
      recentScore,
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_RECENT_GAME_SCORE.recent_game_scores.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TUserGamesResponseKey}.service.GET_RECENT_GAME_SCORE.recent_game_scores.notification.message`, {
        lang,
      }),
    );
  }

  async getUserById(
    seniorId: number,
    paginationParams: NestedPaginationParamsDto,
  ): Promise<TResponse<{ senior: { admins: NestedPaginatedResponseDto<Admin> }; address: Address }>> {
    const senior = await this.userRepository.findOne({
      where: {
        id: seniorId,
      },
      relations: ['status', 'created_by'],
    });

    if (!senior) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'User not found');
    }
    const address = await this.addressRepository.findOne({
      where: {
        user: {
          id: senior.id,
        },
      },
    });
    const { page, pageSize } = paginationParams;

    const [admins, totalAdmins] = await this.adminRepository.findAndCount({
      where: {
        users: {
          id: senior.id,
        },
      },
      relations: ['roles', 'caregiver_roles'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const paginatedAdmins = createPaginatedResponse(admins, paginationParams, totalAdmins);

    const result = {
      senior: {
        ...senior,
        admins: paginatedAdmins,
      },
      address,
    };

    return createResponse(HttpStatus.OK, result, 'User details');
  }

  async getGameScores(
    seniorId: number,
    gameName: EGame,
    filterDto: GetScoresFilterDto,
    initialPeriod: boolean,
  ): Promise<TResponse<Score[]>> {
    const lang = I18nContext.current().lang;

    const user = await this.userRepository.findOne({
      where: {
        id: seniorId,
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

    const queryBuilder = this.scoreRepository
      .createQueryBuilder('scores')
      .leftJoinAndSelect('scores.user', 'user')
      .where('user.id = :seniorId', { seniorId })
      .andWhere('scores.game_name = :gameName', { gameName });

    if (oldestUserScore) {
      const startDate = new Date(oldestUserScore);
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() + EInitiationPeriod.FORTY_TWO_DAYS);
      if (initialPeriod) {
        queryBuilder.andWhere('scores.created_at <= :startDate', { startDate });
      } else {
        queryBuilder.andWhere('scores.created_at >= :startDate', { startDate });
      }
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

  async getGamesList(): Promise<TResponse<EGame[]>> {
    const lang = I18nContext.current().lang;
    const response = Object.values(EGame);

    return createResponse(
      HttpStatus.OK,
      response,
      this.i18n.t(`${TMLResponseKey}.service.GET_GAMES_LIST.success.notification.title`, {
        lang,
      }),
      this.i18n.t(`${TMLResponseKey}.service.GET_GAMES_LIST.success.notification.message`, {
        lang,
      }),
    );
  }
}
