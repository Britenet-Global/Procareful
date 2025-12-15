import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  Patch,
  Put,
  Delete,
  Req,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { TResponse, TUserReq, TUserEmailReq } from 'src/common/types';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  AddSuperInstitutionAdminDto,
  AddSuperInstitutionAdminResponseDto,
  GetSuperInsitutionAdminsFilterDto,
  GetSuperInstitutionAdminDto,
  GetSuperInstitutionAdminResponseDto,
  SetStatusDto,
  UpdateInstitutionNameDto,
  UpdateSuperInstitutionAdminDetailsDto,
  UpdateSuperInstitutionAdminDetailsResponseDto,
  GetInstitutionResponseDto,
  ChangeInstitutionOwnerDto,
  ChangeInstitutionOwnerResponseDto,
  DeactivateInstitutionResponseDto,
  ActivateInstitutionResponseDto,
  DeleteInstitutionResponseDto,
} from './dto';
import {
  BadRequestDto,
  DeleteAdminResponseDto,
  ResendActivationLinkResponseDto,
  SetAdminStatusResponseDto,
} from 'src/common/dto/api-response.dto';
import { IsAuthenticated } from './auth/guard/check.authentication.guard';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ERole } from './types';
import { ApiPaginatedResponse } from '../common/decorators/ApiPaginatedResponse.decorator';
import { FilterDto, UpdateInstitutionDetailsDto, UpdateInstitutionDetailsResponseDto } from '../common/dto';
import { GetInsitutionsFilterDto } from './dto/get-institutions-filter.dto';
import { GetInstitutionDto } from './admin-institution/dto';
import { DateRangeDto } from './dto/generate-report-date.dto';
import { ReportApiKeyGuard } from './guard/report-api-key.guard';

@Controller('')
@UseGuards(IsAuthenticated, RolesGuard)
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('institutions')
  @Roles(ERole.HEAD_ADMIN)
  @ApiPaginatedResponse(GetInstitutionDto, FilterDto)
  async getAllInstitutions(
    @Query() filterDto: GetInsitutionsFilterDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.getAllInstitutions(filterDto, headAdminId);
    return res.status(result.status).send(result);
  }

  @Get('institutions/:id')
  @Roles(ERole.HEAD_ADMIN, ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({ description: 'OK', type: GetInstitutionResponseDto })
  async getInstitutionById(
    @Param('id') id: number,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.getInstitutionById(id, headAdminId);
    return res.status(result.status).send(result);
  }

  @Patch('super-admin-institutions/status/:adminId')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: SetAdminStatusResponseDto,
  })
  async setSuperAdminInstitutionStatus(
    @Body() setStatusDto: SetStatusDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
    @Param('adminId') id: number,
  ): Promise<Response<TResponse<string>>> {
    const result = await this.adminService.setAdminStatus(
      id,
      setStatusDto,
      ERole.SUPER_ADMIN_INSTITUTION,
      undefined,
      headAdminId,
    );
    return res.status(result.status).send(result);
  }

  @Post('super-admin-institutions')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: AddSuperInstitutionAdminResponseDto,
  })
  async addSuperInstitutionAdmin(
    @Req() { user }: TUserReq,
    @Body() addSuperInstitutionAdminDto: AddSuperInstitutionAdminDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.addSuperInstitutionAdmin(addSuperInstitutionAdminDto, user.userId);
    return res.status(result.status).send(result);
  }

  @Get('super-admin-institutions/:id')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: GetSuperInstitutionAdminResponseDto,
  })
  async getSuperInstitutionAdmin(
    @Param('id') id: number,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.getSuperInstitutionAdmin(id, headAdminId);
    return res.status(result.status).send(result);
  }

  @Get('super-admin-institutions')
  @Roles(ERole.HEAD_ADMIN)
  @ApiPaginatedResponse(GetSuperInstitutionAdminDto, FilterDto)
  async getSuperInstitutionAdmins(
    @Query() filterDto: GetSuperInsitutionAdminsFilterDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.getSuperInstitutionAdmins(filterDto, headAdminId);
    return res.status(result.status).send(result);
  }

  @Patch('super-admin-institutions/details/:id')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateSuperInstitutionAdminDetailsResponseDto,
  })
  async updateSuperInstitutionAdminDetails(
    @Param('id') id: number,
    @Body() updateSuperInstitutionAdminDetailsDto: UpdateSuperInstitutionAdminDetailsDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.updateSuperInstitutionAdminDetails(
      id,
      headAdminId,
      updateSuperInstitutionAdminDetailsDto,
    );
    return res.status(result.status).send(result);
  }

  @Delete('super-admin-institutions/:adminId')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteAdminResponseDto,
  })
  async deleteSuperAdminInstitution(
    @Param('adminId') id: number,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.deleteAdmin(id, ERole.SUPER_ADMIN_INSTITUTION, undefined, headAdminId);
    return res.status(result.status).send(result);
  }

  @Patch('institutions/name/:id')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateSuperInstitutionAdminDetailsResponseDto,
  })
  async updateInstitutionName(
    @Param('id') id: number,
    @Body() updateInstitutionNameDto: UpdateInstitutionNameDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.updateInstitutionName(id, updateInstitutionNameDto, headAdminId);
    return res.status(result.status).send(result);
  }

  @Put('institution-details/:adminId')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'UPDATED',
    type: UpdateInstitutionDetailsResponseDto,
  })
  async updateInstitutionDetails(
    @Param('adminId') id: number,
    @Body() updateInstitutionDetailsDto: UpdateInstitutionDetailsDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse<null>>> {
    const result = await this.adminService.updateInstitutionDetails(id, updateInstitutionDetailsDto, headAdminId);
    return res.status(result.status).send(result);
  }

  @Post('super-admin-institutions/resend-activation-link/:adminId')
  @Roles(ERole.HEAD_ADMIN, ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: ResendActivationLinkResponseDto,
  })
  async resendActivationLink(
    @Req() { user }: TUserReq,
    @Param('adminId') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse<null>>> {
    const result = await this.adminService.resendActivationLink(id, user.userId);
    return res.status(result.status).send(result);
  }

  @Post('super-admin-institutions/change-owner/:adminId')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: ChangeInstitutionOwnerResponseDto,
  })
  async changeInstitutionOwner(
    @Param('adminId') id: number,
    @Body() changeInstitutionOwnerDto: ChangeInstitutionOwnerDto,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse<null>>> {
    const result = await this.adminService.changeInstitutionOwner(id, changeInstitutionOwnerDto, headAdminId);
    return res.status(result.status).send(result);
  }

  @Patch('institutions/:institutionId/deactivate')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: DeactivateInstitutionResponseDto,
  })
  async deactivateInstitution(
    @Param('institutionId', ParseIntPipe) id: number,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.deactivateInstitution(id, headAdminId);
    return res.status(result.status).send(result);
  }

  @Patch('institutions/:institutionId/activate')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: ActivateInstitutionResponseDto,
  })
  async activateInstitution(
    @Param('institutionId', ParseIntPipe) id: number,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.activateInstitution(id, headAdminId);
    return res.status(result.status).send(result);
  }

  @Delete('institutions/:institutionId/delete')
  @Roles(ERole.HEAD_ADMIN)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteInstitutionResponseDto,
  })
  async deleteInstitution(
    @Param('institutionId', ParseIntPipe) id: number,
    @Req() { user: { userId: headAdminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.deleteInstitution(id, headAdminId);
    return res.status(result.status).send(result);
  }

  @Get('generate-report/:startDate/:endDate')
  @UseGuards(ReportApiKeyGuard)
  async generateReport(
    @Req()
    {
      user: {
        userData: { email_address },
      },
    }: TUserEmailReq,
    @Res() res: Response,
    @Param() params: DateRangeDto,
  ): Promise<Response> {
    this.adminService.generateReport(params, email_address);
    return res
      .status(HttpStatus.OK)
      .send("The report is being generated, and when it's ready, it will be sent via email.");
  }
}
