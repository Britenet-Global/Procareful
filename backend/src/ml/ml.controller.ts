import { Controller, Get, Param, Query, Res, UseGuards, ParseBoolPipe } from '@nestjs/common';
import { Response } from 'express';
import { ApiExtraModels, ApiOkResponse, ApiParam, getSchemaPath } from '@nestjs/swagger';
import { GameValidationPipe } from 'src/user/games/validations/gameValidationPipe';
import { EGame } from 'src/user/games/types';
import { TResponse } from 'src/common/types';
import { MlService } from './ml.service';
import {
  Game2048RulesResponseDto,
  GetGameDifficultyLevelsResponseDto,
  GetGamesListResponseDto,
  GetRecentGameScoreResponseDto,
  MemoryRulesResponseDto,
  SnakeRulesResponseDto,
  SudokuRulesResponseDto,
  TicTacToeRulesResponseDto,
  WordGuessRulesResponseDto,
  WordleRulesResponseDto,
} from './dto';
import { ApiPaginatedResponse } from 'src/common/decorators/ApiPaginatedResponse.decorator';
import { GetScoresDto, GetScoresFilterDto } from 'src/user/games/dto/get-scores.dto';
import { FilterDto } from 'src/common/dto';
import { GamesService } from 'src/user/games/games.service';
import { GetUserResponseDto } from 'src/admin/admin-institution/dto';
import { NestedPaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { ApiKeyGuard } from './guard/api-key.guard';

export const gameRulesResponseDto = [
  Game2048RulesResponseDto,
  MemoryRulesResponseDto,
  SnakeRulesResponseDto,
  TicTacToeRulesResponseDto,
  SudokuRulesResponseDto,
  WordGuessRulesResponseDto,
  WordleRulesResponseDto,
];

@Controller()
@UseGuards(ApiKeyGuard)
export class MlController {
  constructor(
    private readonly mlService: MlService,
    private readonly gamesService: GamesService,
  ) {}

  @Get(':userId/games/:gameName/level')
  @ApiExtraModels(...gameRulesResponseDto)
  @ApiOkResponse({
    description: 'OK',
    schema: {
      oneOf: gameRulesResponseDto.map((dto) => ({
        $ref: getSchemaPath(dto),
      })),
    },
  })
  async getGameRules(
    @Param('userId') userId: number,
    @Param('gameName', GameValidationPipe) gameName: EGame,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.gamesService.getGameRules(userId, gameName);
    return res.status(result.status).send(result);
  }

  @Get('levels/:gameName')
  @ApiOkResponse({
    description: 'OK',
    type: GetGameDifficultyLevelsResponseDto,
  })
  async getGameDifficultyLevels(
    @Param('gameName', GameValidationPipe) gameName: EGame,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.mlService.getGameDifficultyLevels(gameName);
    return res.status(result.status).send(result);
  }

  @Get(':userId/games/:gameName/scores')
  @ApiPaginatedResponse(GetScoresDto, FilterDto)
  @ApiParam({ name: 'viewer', required: false })
  async getGameScores(
    @Param('userId') seniorId: number,
    @Param('gameName', GameValidationPipe) gameName: EGame,
    @Query('initialPeriod', ParseBoolPipe) initialPeriod: boolean,
    @Query() filterDto: GetScoresFilterDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.mlService.getGameScores(seniorId, gameName, filterDto, initialPeriod);
    return res.status(result.status).send(result);
  }

  @Get(':userId/games/:gameName/last_score')
  @ApiOkResponse({
    description: 'OK',
    type: GetRecentGameScoreResponseDto,
  })
  async getRecentGameScore(
    @Param('userId') seniorId: number,
    @Param('gameName', GameValidationPipe) gameName: EGame,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.mlService.getRecentGameScore(seniorId, gameName);
    return res.status(result.status).send(result);
  }

  @Get('users/:id')
  @ApiOkResponse({
    description: 'OK',
    type: GetUserResponseDto,
  })
  async getUserById(
    @Param('id') id: number,
    @Query() paginationParams: NestedPaginationParamsDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.mlService.getUserById(id, paginationParams);
    return res.status(result.status).send(result);
  }

  @Get('games/list')
  @ApiOkResponse({
    description: 'OK',
    type: GetGamesListResponseDto,
  })
  async getGamesList(@Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.mlService.getGamesList();
    return res.status(result.status).send(result);
  }
}
