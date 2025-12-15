import { Controller, Get, Param, Query, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { TResponse, TUserReq } from 'src/common/types';
import { GamesService } from './games.service';
import { EGame, EScoreViewer } from './types';
import { ApiParam } from '@nestjs/swagger';
import { GameValidationPipe } from './validations/gameValidationPipe';
import { GetScoresDto, GetScoresDateDto, GetScoresFilterDto } from './dto/get-scores.dto';
import { ApiPaginatedResponse } from '../../common/decorators/ApiPaginatedResponse.decorator';
import { FilterDto } from '../../common/dto';
import { RolesGuard } from 'src/admin/guard/roles.guard';
import { IsAuthenticated } from 'src/admin/auth/guard/check.authentication.guard';
import { Roles } from 'src/admin/decorators/roles.decorator';
import { ERole } from 'src/admin/types';
import { ScoreViewerValidationPipe } from './validations/scoreViewerValidationPipe';

@Controller('')
@UseGuards(RolesGuard, IsAuthenticated)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':userId/games/:gameName/scores/:viewer?')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiPaginatedResponse(GetScoresDto, FilterDto)
  @ApiParam({ name: 'viewer', required: false })
  async getGameScores(
    @Param('userId') seniorId: number,
    @Param('gameName', GameValidationPipe) gameName: EGame,
    @Param('viewer', ScoreViewerValidationPipe) viewer: EScoreViewer,
    @Query() filterDto: GetScoresFilterDto,
    @Query() getScoresDto: GetScoresDateDto,
    @Res() res: Response,
    @Req() { user: { userId } }: TUserReq,
  ): Promise<Response<TResponse>> {
    const result = await this.gamesService.getGameScores(userId, seniorId, gameName, filterDto, getScoresDto, viewer);
    return res.status(result.status).send(result);
  }
}
