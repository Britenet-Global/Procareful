import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AddFormalCaregiverDto,
  AddFormalCaregiverResponseDto,
  AddInformalCaregiverDto,
  AddInformalCaregiverResponseDto,
  AddInstitutionAdminDto,
  AddInstitutionAdminResponseDto,
  AssignFormalCaregiverToSeniorResponseDto,
  AssignInformalCaregiverToSeniorResponseDto,
  AssignWorkingHoursResponseDto,
  DeleteImageResponseDto,
  DeleteUserResponseDto,
  EditSeniorsFormalCaregiverDto,
  EditSeniorsFormalCaregiverResponseDto,
  GetAdminsInstitutionFilterDto,
  GetFormalCaregiverResponseDto,
  GetFormalCaregiverRolesResponseDto,
  GetFormalCaregiversDto,
  GetFormalCaregiversFilterDto,
  GetImageResponseDto,
  GetInformalCaregiverResponseDto,
  GetInformalCaregiversDto,
  GetInformalCaregiversFilterDto,
  GetInstitutionAdminResponseDto,
  GetInstitutionAdminsDto,
  GetInstitutionResponseDto,
  GetOnboardingStepsDto,
  GetOnboardingStepStatusResponseDto,
  GetUserResponseDto,
  GetUsersDto,
  GetUsersFilterDto,
  GetWorkingHoursResponseDto,
  RevokeInformalCaregiverFromSeniorResponseDto,
  SetMyFirstNameDto,
  SetMyPersonalSettingsDto,
  UpdateAdminContactDto,
  UpdateAdminInfoDto,
  UpdateAdminInstitutionInfoResponseDto,
  UpdateCaregiverContactDto,
  UpdateCaregiverInfoDto,
  UpdateCaregiverRoleDto,
  UpdateContactDto,
  UpdateContactResponseDto,
  UpdateFormalCaregiverDetailsDto,
  UpdateFormalCaregiverRoleResponseDto,
  UpdateIARolesResponseDto,
  UpdateInfoDto,
  UpdateInfoResponseDto,
  UpdateInformalCaregiverInfoResponseDto,
  UpdateOnboardingStepsResponseDto,
  UploadImageResponseDto,
  WorkingHoursDto,
} from './dto';
import { AdminInstitutionService } from './admin-institution.service';
import { Response } from 'express';
import { ESortOrder, TControllerType, TResponse, TUserReq } from 'src/common/types';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BadRequestDto, DeleteAdminResponseDto, SetAdminStatusResponseDto } from 'src/common/dto/api-response.dto';
import { RolesGuard } from '../guard/roles.guard';
import { IsAuthenticated } from '../auth/guard/check.authentication.guard';
import { Roles } from '../decorators/roles.decorator';
import { ERole } from '../types';
import { ApiPaginatedResponse } from '../../common/decorators/ApiPaginatedResponse.decorator';
import { User } from '../../user/entities/user.entity';
import {
  FilterCaregiverDto,
  FilterDto,
  UpdateInstitutionDetailsDto,
  UpdateInstitutionDetailsResponseDto,
} from '../../common/dto';
import { SetStatusDto, UpdateInstitutionAdminRoleDto } from '../dto';
import { AdminService } from '../admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/validations/fileValidationPipe';
import { Admin } from '../entities';
import { GetDashboardInstitutionViewResponse, GetMostActiveUsersResponseDto } from '../caregiver/dto';
import { SortOrderValidationPipe } from '../caregiver/validations/SortOrderValidationPipe';
import { DashboardsService } from '../caregiver/dashboards/dashboards.service';
import { InstitutionUserRetrievalStrategy } from '../caregiver/dashboards/strategies/InstitutionUserRetrieval.strategy';
import { NestedPaginationParamsDto } from '../../common/dto/pagination-params.dto';

@Controller('institution')
@UseGuards(IsAuthenticated, RolesGuard)
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
export class AdminInstitutionController {
  constructor(
    private readonly adminInstitutionService: AdminInstitutionService,
    private readonly adminService: AdminService,
    private readonly institutionUserRetrievalStrategy: InstitutionUserRetrievalStrategy,
    private readonly dashboardsService: DashboardsService,
  ) {}

  @Put('details/my')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'UPDATED',
    type: UpdateInstitutionDetailsResponseDto,
  })
  async updateMyInstitutionDetails(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateInstitutionDetailsDto: UpdateInstitutionDetailsDto,
    @Res() res: Response,
  ): Promise<Response<TResponse<null>>> {
    const result = await this.adminInstitutionService.updateMyInstitutionDetails(userId, updateInstitutionDetailsDto);
    return res.status(result.status).send(result);
  }

  @Post('admins-institution')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddInstitutionAdminResponseDto,
  })
  async addInstitutionAdmin(
    @Body() addInstitutionAdminDto: AddInstitutionAdminDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.addInstitutionAdmin(addInstitutionAdminDto, userId);
    return res.status(result.status).send(result);
  }

  @Get('admins-institution')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiPaginatedResponse(GetInstitutionAdminsDto, FilterDto)
  async getAllAdminsInstitution(
    @Query() filterDto: GetAdminsInstitutionFilterDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getAdminsInstitution(filterDto, userId);
    return res.status(result.status).send(result);
  }

  @Patch('admins-institution/status/:adminId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: SetAdminStatusResponseDto,
  })
  async setAdminsInstitutionStatus(
    @Body() setStatusDto: SetStatusDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('adminId') id: number,
  ): Promise<Response<TResponse<string>>> {
    const result = await this.adminService.setAdminStatus(id, setStatusDto, ERole.ADMIN_INSTITUTION, userId);
    return res.status(result.status).send(result);
  }

  @Delete('admins-institution/:adminId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteAdminResponseDto,
  })
  async deleteAdminsInstitution(
    @Param('adminId') id: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.deleteAdmin(id, ERole.ADMIN_INSTITUTION, userId);
    return res.status(result.status).send(result);
  }

  @Patch('caregiver/status/:caregiverId/:caregiverRole')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: SetAdminStatusResponseDto,
  })
  async setCaregiverStatus(
    @Req() { user: { userId } }: TUserReq,
    @Body() setStatusDto: SetStatusDto,
    @Res() res: Response,
    @Param('caregiverId') id: number,
    @Param('caregiverRole') caregiverRole: ERole.FORMAL_CAREGIVER | ERole.INFORMAL_CAREGIVER,
  ): Promise<Response<TResponse<string>>> {
    const result = await this.adminService.setAdminStatus(id, setStatusDto, caregiverRole, userId);
    return res.status(result.status).send(result);
  }

  @Get('users')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiPaginatedResponse(GetUsersDto, FilterDto)
  async getUsers(
    @Query() filterDto: GetUsersFilterDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getUsers(filterDto, userId);
    return res.status(result.status).send(result);
  }

  @Get('users/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserResponseDto,
  })
  async getUserById(
    @Req() { user: { userId } }: TUserReq,
    @Param('id') id: number,
    @Query() paginationParams: NestedPaginationParamsDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getUserById(id, userId, paginationParams);
    return res.status(result.status).send(result);
  }

  @Patch('users/info/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateInfoResponseDto,
  })
  async updateInfoUserById(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateUserInfoDto: UpdateInfoDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateInfoById(id, userId, User, updateUserInfoDto);
    return res.status(result.status).send(result);
  }

  @Patch('users/contact/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  async updateContactUserById(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateUserContactDto: UpdateContactDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateContactById(id, userId, User, updateUserContactDto);
    return res.status(result.status).send(result);
  }

  @Get('details/my-institution')
  @ApiOkResponse({ description: 'OK', type: GetInstitutionResponseDto })
  @Roles(ERole.ADMIN_INSTITUTION, ERole.SUPER_ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  async getInstitutionDetails(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getInstitutionDetails(userId);
    return res.status(result.status).send(result);
  }
  @Patch('working-hours')
  @Roles(ERole.ADMIN_INSTITUTION, ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({ description: 'OK', type: AssignWorkingHoursResponseDto })
  async updateWorkingHours(
    @Req() { user: { userId } }: TUserReq,
    @Body() workingHoursDto: WorkingHoursDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateWorkingHours(
      userId,
      workingHoursDto,
      TControllerType.INSTITUTION,
    );
    return res.status(result.status).send(result);
  }
  @Get('working-hours')
  @Roles(ERole.ADMIN_INSTITUTION, ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({ description: 'OK', type: GetWorkingHoursResponseDto })
  async getWorkingHours(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getWorkingHours(userId, TControllerType.INSTITUTION);
    return res.status(result.status).send(result);
  }
  @Post('formal-caregivers')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddFormalCaregiverResponseDto,
  })
  async addFormalCaregiver(
    @Body() addFormalCaregiverDto: AddFormalCaregiverDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.addFormalCaregiver(addFormalCaregiverDto, userId);
    return res.status(result.status).send(result);
  }

  @Patch('formal-caregivers/info/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateFormalCaregiverDetailsDto,
  })
  async updateFormalCaregiverInfo(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateInfoDto: UpdateCaregiverInfoDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateCaregiverInfo(
      id,
      userId,
      ERole.FORMAL_CAREGIVER,
      updateInfoDto,
    );
    return res.status(result.status).send(result);
  }

  @Get('formal-caregivers/roles')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetFormalCaregiverRolesResponseDto,
  })
  async getFormalCaregiverRoles(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getFormalCaregiverRoles(caregiverId);
    return res.status(result.status).send(result);
  }

  @Patch('formal-caregivers/roles/:caregiverId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateFormalCaregiverDetailsDto,
  })
  async updateFormalCaregiverRoles(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateInfoDto: UpdateCaregiverRoleDto,
    @Res() res: Response,
    @Param('caregiverId') caregiverId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateFormalCaregiverRoles(userId, updateInfoDto, caregiverId);
    return res.status(result.status).send(result);
  }

  @Patch('roles/:adminId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateIARolesResponseDto,
  })
  async updateRoles(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateInfoDto: UpdateInstitutionAdminRoleDto,
    @Param('adminId') adminId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateAdminRoles(userId, adminId, updateInfoDto);
    return res.status(result.status).send(result);
  }
  @Patch('formal-caregivers/contact/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateFormalCaregiverDetailsDto,
  })
  async updateFormalCaregiverContact(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateContactDto: UpdateCaregiverContactDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateCaregiverContact(
      id,
      userId,
      ERole.FORMAL_CAREGIVER,
      updateContactDto,
    );
    return res.status(result.status).send(result);
  }

  @Post('informal-caregivers')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddInformalCaregiverResponseDto,
  })
  async addInformalCaregiver(
    @Body() addInformalCaregiverDto: AddInformalCaregiverDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.addInformalCaregiver(addInformalCaregiverDto, userId);
    return res.status(result.status).send(result);
  }

  @Get('informal-caregivers')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiPaginatedResponse(GetInformalCaregiversDto, FilterDto)
  async getInformalCaregivers(
    @Query() filterDto: GetInformalCaregiversFilterDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getInformalCaregivers(filterDto, userId);
    return res.status(result.status).send(result);
  }

  @Patch('informal-caregivers/info/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateInformalCaregiverInfoResponseDto,
  })
  async updateInformalCaregiverInfo(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateInformalCaregiverInfoDto: UpdateCaregiverInfoDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateCaregiverInfo(
      id,
      userId,
      ERole.INFORMAL_CAREGIVER,
      updateInformalCaregiverInfoDto,
    );
    return res.status(result.status).send(result);
  }

  @Patch('informal-caregivers/contact/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  async updateInformalCaregiverContact(
    @Req() { user: { userId } }: TUserReq,
    @Body() updateInformalCaregiverContactDto: UpdateCaregiverContactDto,
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateCaregiverContact(
      id,
      userId,
      ERole.INFORMAL_CAREGIVER,
      updateInformalCaregiverContactDto,
    );
    return res.status(result.status).send(result);
  }

  @Get('formal-caregivers')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiPaginatedResponse(GetFormalCaregiversDto, FilterCaregiverDto)
  async getFormalCaregivers(
    @Query() filterDto: GetFormalCaregiversFilterDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getFormalCaregivers(filterDto, userId);
    return res.status(result.status).send(result);
  }

  @Get('formal-caregivers/available-for-user/:userId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER)
  @ApiPaginatedResponse(GetInformalCaregiversDto, FilterDto)
  async getFormalCaregiversAvailableForUser(
    @Query() filterDto: GetInformalCaregiversFilterDto,
    @Req() { user: { userId } }: TUserReq,
    @Param('userId', ParseIntPipe) seniorId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getFormalCaregiversAvailableForUser(filterDto, userId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('formal-caregivers/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetFormalCaregiverResponseDto,
  })
  async getFormalCaregiver(
    @Param('id') id: number,
    @Query() paginationParams: NestedPaginationParamsDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getFormalCaregiver(id, userId, paginationParams);
    return res.status(result.status).send(result);
  }

  @Get('informal-caregivers/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetInformalCaregiverResponseDto,
  })
  async getInformalCaregiver(
    @Param('id') id: number,
    @Query() paginationParams: NestedPaginationParamsDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getInformalCaregiver(id, userId, paginationParams);
    return res.status(result.status).send(result);
  }

  @Get('admins/:id')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetInstitutionAdminResponseDto,
  })
  async getInstitutionAdmin(
    @Param('id') id: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getInstitutionAdmin(id, userId);
    return res.status(result.status).send(result);
  }

  @Patch('users/formal-caregiver/:id')
  @Roles(ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: EditSeniorsFormalCaregiverResponseDto,
  })
  async editSeniorsFormalCaregiver(
    @Param('id') seniorId: number,
    @Body() { newFormalCaregiverId }: EditSeniorsFormalCaregiverDto,
    @Req() { user: { userId } }: TUserReq,
    @Res()
    res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.editSeniorsFormalCaregiver(
      seniorId,
      newFormalCaregiverId,
      userId,
    );
    return res.status(result.status).send(result);
  }

  @Delete('caregiver/:caregiverId/:caregiverRole')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteAdminResponseDto,
  })
  async deleteCaregiver(
    @Req() { user: { userId } }: TUserReq,
    @Param('caregiverId') id: number,
    @Param('caregiverRole') caregiverRole: ERole.FORMAL_CAREGIVER | ERole.INFORMAL_CAREGIVER,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminService.deleteAdmin(id, caregiverRole, userId);
    return res.status(result.status).send(result);
  }

  @Patch('user/status/:seniorId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
  })
  async setUserStatus(
    @Body() setStatusDto: SetStatusDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('seniorId') id: number,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.setUserStatus(id, setStatusDto, userId);
    return res.status(result.status).send(result);
  }

  @Post('image/upload')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UploadImageResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImageForAdmin(
    @Res() res: Response,
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
    @Req() { user: { userId } }: TUserReq,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.uploadImage(image, userId);
    return res.status(result.status).send(result);
  }

  @Post('image/upload/:seniorId?')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UploadImageResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImageForSenior(
    @Res() res: Response,
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
    @Req() { user: { userId } }: TUserReq,
    @Param('seniorId') seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.uploadImage(image, userId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('image/admin')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetImageResponseDto,
  })
  async getAdminImage(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getImage(userId, Admin);
    return res.status(result.status).send(result);
  }

  @Get('image/user/:userId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetImageResponseDto,
  })
  async getUserImage(@Param('userId') userId: number, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getImage(userId, User);
    return res.status(result.status).send(result);
  }

  @Delete('image/delete')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteImageResponseDto,
  })
  async deleteAdminImage(@Res() res: Response, @Req() { user: { userId } }: TUserReq): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.deleteImage(userId);
    return res.status(result.status).send(result);
  }

  @Delete('image/delete/:seniorId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteImageResponseDto,
  })
  async deleteUserImage(
    @Res() res: Response,
    @Req() { user: { userId } }: TUserReq,
    @Param('seniorId') seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.deleteImage(userId, seniorId);
    return res.status(result.status).send(result);
  }

  @Patch('personal-settings/my')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
  })
  async setMyPersonalSettings(
    @Body() setMyPersonalSettingsDto: SetMyPersonalSettingsDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.setMyPersonalSettings(setMyPersonalSettingsDto, userId);
    return res.status(result.status).send(result);
  }

  @Patch('first-name/my')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
  })
  async setMyFirstName(
    @Body() { first_name }: SetMyFirstNameDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.setMyFirstName(first_name, userId);
    return res.status(result.status).send(result);
  }

  @Patch('admins-institution/contact/:adminId?')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  @ApiParam({ name: 'adminId', required: false })
  async updateAdminInstitutionContact(
    @Req() { user: { userId } }: TUserReq,
    @Param('adminId') adminId: number,
    @Body() updateContactDto: UpdateAdminContactDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateAdminInstitutionContact(userId, updateContactDto, adminId);
    return res.status(result.status).send(result);
  }

  @Patch('admins-institution/info/:adminId?')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateAdminInstitutionInfoResponseDto,
  })
  @ApiParam({ name: 'adminId', required: false })
  async updateAdminInstitutionInfo(
    @Req() { user: { userId } }: TUserReq,
    @Param('adminId') adminId: number,
    @Body() updateInfoDto: UpdateAdminInfoDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateAdminInstitutionInfo(userId, updateInfoDto, adminId);
    return res.status(result.status).send(result);
  }

  @Post('onboarding/steps/:step')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateOnboardingStepsResponseDto,
  })
  async updateOnboardingSteps(
    @Req()
    { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('step') step: number,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateOnboardingSteps(userId, step);
    return res.status(result.status).send(result);
  }

  @Get('onboarding/steps')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetOnboardingStepsDto,
  })
  async getOnboardingSteps(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<GetOnboardingStepsDto>> {
    const result = await this.adminInstitutionService.getOnboardingSteps(userId);
    return res.status(result.status).send(result);
  }

  @Get('onboarding/steps/:step')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetOnboardingStepStatusResponseDto,
  })
  async getOnboardingStepStatus(
    @Param('step', ParseIntPipe) step: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getOnboardingStepStatus(userId, step);
    return res.status(result.status).send(result);
  }

  @Post('informal-caregivers/assign/:caregiverId/user/:userId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: AssignInformalCaregiverToSeniorResponseDto,
  })
  async assignInformalCaregiverToSenior(
    @Param('caregiverId') caregiverId: number,
    @Param('userId') seniorId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.assignInformalCaregiverToSenior(userId, caregiverId, seniorId);
    return res.status(result.status).send(result);
  }
  @Delete('informal-caregivers/revoke/:caregiverId/user/:userId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: RevokeInformalCaregiverFromSeniorResponseDto,
  })
  async revokeInformalCaregiverFromSenior(
    @Param('caregiverId') caregiverId: number,
    @Param('userId') seniorId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.revokeInformalCaregiverFromSenior(userId, caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Delete('users/:userId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteUserResponseDto,
  })
  async deleteUser(
    @Param('userId') seniorId: number,
    @Req() { user: { userId: adminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.deleteUser(adminId, seniorId);
    return res.status(result.status).send(result);
  }

  @Post('formal-caregivers/assign/:caregiverId/user/:userId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: AssignFormalCaregiverToSeniorResponseDto,
  })
  async assignFormalCaregiverToSenior(
    @Param('caregiverId') caregiverId: number,
    @Param('userId') seniorId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.assignFormalCaregiverToSenior(userId, caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Put('formal-caregivers/:caregiverId/roles')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateFormalCaregiverRoleResponseDto,
  })
  async updateFormalCaregiverRole(
    @Req() { user: { userId: adminId } }: TUserReq,
    @Param('caregiverId') caregiverId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateFormalCaregiverRole(adminId, caregiverId);
    return res.status(result.status).send(result);
  }

  @Get('users/dashboards/most-active-users')
  @Roles(ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetMostActiveUsersResponseDto,
  })
  @ApiQuery({
    required: false,
    name: 'sortOrder',
    enum: ESortOrder,
  })
  async getMostActiveSeniors(
    @Req() { user }: TUserReq,
    @Res() res: Response,
    @Query('sortOrder', SortOrderValidationPipe) sortOrder?: ESortOrder,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getMostActiveSeniors(
      user.userId,
      sortOrder,
      this.institutionUserRetrievalStrategy,
    );
    return res.status(result.status).send(result);
  }

  @Get('users/dashboards/admin-view')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetDashboardInstitutionViewResponse,
  })
  @ApiQuery({
    required: false,
    name: 'sortOrder',
    enum: ESortOrder,
  })
  async getDashboardAdminView(
    @Res() res: Response,
    @Req() { user: { userId } }: TUserReq,
    @Query('sortOrder', SortOrderValidationPipe) sortOrder?: ESortOrder,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getDashboardInsitutionView(userId, sortOrder);
    return res.status(result.status).send(result);
  }

  @Delete('formal-caregivers/:caregiverId/senior/:seniorId')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION)
  async removeFormalCaregiverSeniorAssignment(
    @Param('caregiverId', ParseIntPipe) caregiverId: number,
    @Param('seniorId', ParseIntPipe) seniorId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.adminInstitutionService.removeFormalCaregiverSeniorAssignment(
      caregiverId,
      seniorId,
      userId,
    );
    return res.status(result.status).send(result);
  }
}
