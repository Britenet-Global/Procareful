import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { BadRequestDto, FilterDto, FilterMyNotificationsDto, FilterNotesDto } from '../../common/dto';
import { ESortOrder, TControllerType, TResponse, TUserReq } from '../../common/types';
import { FilesValidationPipe } from '../../common/validations/filesValidationPipe';
import { NotesService } from '../../notes/notes.service';
import { FileArray, TDownloadNoteAttachment } from '../../notes/types';
import { AdminInstitutionService } from '../admin-institution/admin-institution.service';
import {
  AddCustomScheduleResponseDto,
  AddressDto,
  AssignWorkingHoursResponseDto,
  DeleteSeniorDocumentResponseDto,
  DeleteUserResponseDto,
  DownloadSeniorDocumentsResponseDto,
  GetAddSeniorFormStepsDto,
  GetSecurityCodeResponseDto,
  GetWorkingHoursResponseDto,
  UpdateBasicInformationDto,
  UpdateContactBaseDto,
  UpdateContactDto,
  UpdateCustomScheduleResponseDto,
  UpdateInfoDto,
  UpdateOnboardingStepsResponseDto,
  UploadSeniorDocumentsResponseDto,
  ViewDocumentsResponseDto,
  WorkingHoursDto,
} from '../admin-institution/dto';
import { IsAuthenticated } from '../auth/guard/check.authentication.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { EContactType, ERole } from '../types';
import { CaregiverService } from './caregiver.service';
import {
  AddAdditionalInfoResponseDto,
  AddFamilyDoctorDto,
  AddFamilyDoctorResponseDto,
  AddNoteDto,
  AddNoteResponseDto,
  AddSupportingContactResponseDto,
  AddUserAddressResponseDto,
  AddUserAssessmentResponseDto,
  AddUserDto,
  AddUserResponseDto,
  CheckIfInformalCaregiverExistsDto,
  CheckIfInformalCaregiverExistsResponseDto,
  DeleteFamilyDoctorContactResponseDto,
  DeleteNoteResponseDto,
  DeleteSupportingContactResponseDto,
  DownloadNoteAttachmentResponseDto,
  EditCarePlanReasonDto,
  EditCarePlanReasonResponse,
  GetDashboardInstitutionViewResponse,
  GetDocumentsDto,
  GetDocumentsFilterDto,
  GetFamilyDoctorResponseDto,
  GetGeneratedSchedulesResponseDto,
  GetMostActiveUsersResponseDto,
  GetMyNotificationsDto,
  GetMyNotificationsFilterDto,
  GetNoteAuthorsResponseDto,
  GetNoteResponseDto,
  GetNotesDto,
  GetNotesFilterDto,
  GetPersonalDetailsResponseDto,
  GetSupportingContactResponseDto,
  GetUserAssessmentScoreResponseDto,
  GetUserIdResponseDto,
  GetUserInfoResponseDto,
  GetUserMobilityLevelResponseDto,
  GetUserPerformanceResponse,
  GetUserPhysicalPerformanceResponse,
  GetUsersAdditionalFilters,
  GetUsersFilterDto,
  GetWalkingTimeResponseDto,
  ScheduleBedriddenDto,
  ScheduleMobilityLimitationsDto,
  ScheduleNoLimitationsDto,
  SendLandingPageLinkViaEmailResponseDto,
  UpdateContactResponseDto,
  UpdateFamilyDoctorResponseDto,
  UpdateNoteDto,
  UpdateNoteResponseDto,
  UpdateSupportingContactResponseDto,
  GetFormalCaregiverByIdResponseDto,
  CheckIsANeedDisplayUserPerformanceWarningResponseDto,
  SendPerformanceWarningResponseDto,
  AssignInformalCaregiverAsSupportingContactToSeniorResponse,
} from './dto';
import { EActivityLevel, ESeniorFormType, EUserAssessmentAreas, SeniorDocumentsFilesArray } from './types';
import { SeniorFormTypeValidationPipe } from './validations/SeniorFormTypeValidationPipe';
import { NotificationsService } from '../../notifications/notifications.service';
import { ApiPaginatedResponse } from 'src/common/decorators/ApiPaginatedResponse.decorator';
import {
  GetNotificationSettingsResponseDto,
  GetQrCodeResponseDto,
  GetUnreadNotificationCountResponseDto,
  MarkNotificationAsADisplayedResponseDto,
  PatchNotificationSettingsResponseDto,
  UpdateNotificationSettingsDto,
} from '../../notifications/dto';
import { AddUserAssessmentDto } from './dto/add-user-assessment.dto';
import { GetAssessmentScoreByAreaValidationPipe } from './validations/GetAssessmentScoreByAreaValidationPipe';
import { AddSupportingContactDto } from './dto/supporting-contact.dto';
import { SchedulesService } from './schedules/schedules.service';
import { GetUserScheduleResponse } from './schedules/dto';
import { GetUsersForCaregiverWithImageDto } from './dto/get-user.dto';
import { ActivityLevelValidationPipe } from './validations/ActivityLevelValidationPipe';
import { EPersonalGrowth, TGeneratedSchedules } from './schedules/types';
import { PersonalGrowthValidationPipe } from './validations/PersonalGrowthValidationPipe';
import { TAdminCaregiverResponseKey } from '../../common/utils/translationKeys';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DashboardsService } from './dashboards/dashboards.service';
import { GetGamesEngagementResponseDto } from './dashboards/dto/api-response.dto';
import { SortOrderValidationPipe } from './validations/SortOrderValidationPipe';
import { CaregiverUserRetrievalStrategy } from './dashboards/strategies/CaregiverUserRetrieval.strategy';
import { NestedPaginationParamsDto, OptionalNestedPaginationParamsDto } from '../../common/dto/pagination-params.dto';

@Controller('caregiver')
@UseGuards(IsAuthenticated, RolesGuard)
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
export class CaregiverController {
  constructor(
    private readonly caregiverService: CaregiverService,
    private readonly adminInstitutionService: AdminInstitutionService,
    private readonly notesService: NotesService,
    private readonly notificationService: NotificationsService,
    private readonly schedulesService: SchedulesService,
    private readonly dashboardsService: DashboardsService,
    private readonly caregiverRetrievalStrategy: CaregiverUserRetrievalStrategy,
  ) {}

  private mimeTypes: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  @Post('users')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddUserResponseDto,
  })
  async addUser(
    @Body() addUserDto: AddUserDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.addUser(addUserDto, caregiverId);
    return res.status(result.status).send(result);
  }

  @Get('users')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiPaginatedResponse(GetUsersForCaregiverWithImageDto, FilterDto)
  async getUsers(
    @Query() filterDto: GetUsersFilterDto,
    @Req()
    { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Query() additionalFilters?: GetUsersAdditionalFilters,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getUsers(caregiverId, filterDto, additionalFilters);
    return res.status(result.status).send(result);
  }

  @Get('users/myUser')
  @Roles(ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserIdResponseDto,
  })
  async getMyUser(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getMyUser(caregiverId);
    return res.status(result.status).send(result);
  }

  @Patch('users/address/:userId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'OK',
    type: AddUserAddressResponseDto,
  })
  async addAddress(
    @Body() addUserDto: AddressDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.assignUsersAddress(addUserDto, caregiverId, userId);
    return res.status(result.status).send(result);
  }

  @Patch('users/info/:userId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  async updateUserInfo(
    @Body() updateUserDto: UpdateInfoDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.updateUserInfo(updateUserDto, caregiverId, userId);
    return res.status(result.status).send(result);
  }

  @Patch('users/contact/:userId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  async updateContact(
    @Body() updateUserDto: UpdateContactBaseDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.updateContactToUser(updateUserDto, caregiverId, userId);
    return res.status(result.status).send(result);
  }

  @Patch('users/basic-information/:userId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  async updateBasicInformation(
    @Body() updateUserDto: UpdateBasicInformationDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.updateBasicInformation(updateUserDto, caregiverId, userId);
    return res.status(result.status).send(result);
  }

  @Patch('users/contact-information/:userId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'OK',
    type: UpdateContactResponseDto,
  })
  async updateContactInformation(
    @Body() updateUserDto: UpdateContactDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.assignUsersAddressAndContact(updateUserDto, caregiverId, userId);
    return res.status(result.status).send(result);
  }

  @Get('users/info/:userId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserInfoResponseDto,
  })
  async getUser(
    @Param('userId') userId: number,
    @Query() paginationParams: OptionalNestedPaginationParamsDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getUserInfo(userId, caregiverId, paginationParams);
    return res.status(result.status).send(result);
  }

  @Patch('working-hours')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({ description: 'OK', type: AssignWorkingHoursResponseDto })
  async updateWorkingHours(
    @Req() { user: { userId } }: TUserReq,
    @Body() workingHoursDto: WorkingHoursDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.updateWorkingHours(
      userId,
      workingHoursDto,
      TControllerType.CAREGIVER,
    );
    return res.status(result.status).send(result);
  }

  @Get('working-hours')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({ description: 'OK', type: GetWorkingHoursResponseDto })
  async getWorkingHours(@Req() { user: { userId } }: TUserReq, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.adminInstitutionService.getWorkingHours(userId, TControllerType.CAREGIVER);
    return res.status(result.status).send(result);
  }

  @Get('notes/:seniorId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiPaginatedResponse(GetNotesDto, FilterNotesDto)
  async getNotes(
    @Query() filterDto: GetNotesFilterDto,
    @Req() { user: { userId } }: TUserReq,
    @Param('seniorId') seniorId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.getNotes(userId, seniorId, filterDto);
    return res.status(result.status).send(result);
  }

  @Delete('notes/:noteId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteNoteResponseDto,
  })
  async deleteNote(
    @Param('noteId') noteId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.deleteNote(userId, noteId);
    return res.status(result.status).send(result);
  }

  @Post('notes/:seniorId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddNoteResponseDto,
  })
  async addNote(
    @Req() { user: { userId } }: TUserReq,
    @Param('seniorId') seniorId: number,
    @Body() addNoteDto: AddNoteDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.addNote(userId, seniorId, addNoteDto);
    return res.status(result.status).send(result);
  }

  @Post('notes/attachments/:noteId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'CREATED',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadNote(
    @Req() { user: { userId } }: TUserReq,
    @UploadedFiles(new FilesValidationPipe(true)) files: FileArray,
    @Param('noteId') noteId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.uploadFilesToNote(files, noteId, userId);
    return res.status(result.status).send(result);
  }

  @Get('notes/authors/:seniorId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetNoteAuthorsResponseDto,
  })
  async getNoteAuthors(
    @Param('seniorId') seniorId: number,
    @Req() { user: { userId: adminId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.getNoteAuthors(adminId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('notes/attachments/:attachmentId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DownloadNoteAttachmentResponseDto,
  })
  async downloadNoteAttachment(
    @Param('attachmentId') attachmentId: number,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.downloadNoteAttachment(caregiverId, attachmentId);

    if (result.status !== HttpStatus.OK) {
      return res.status(result.status).json(result);
    }

    const { attachment, name, extension } = result.details as unknown as TDownloadNoteAttachment;
    const contentType = this.mimeTypes[`.${extension.toLowerCase()}`] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${name}`);

    return res.status(result.status).send(attachment);
  }

  @Get('notes/:seniorId/:noteId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({ description: 'OK', type: GetNoteResponseDto })
  async getNoteById(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('seniorId') seniorId: number,
    @Param('noteId') noteId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.getNoteById(caregiverId, seniorId, noteId);
    return res.status(result.status).send(result);
  }

  @Patch('notes/:noteId')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateNoteResponseDto,
  })
  async updateNote(
    @Param('noteId') noteId: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notesService.updateNote(userId, noteId, updateNoteDto);
    return res.status(result.status).send(result);
  }
  @Get('users/:userId/performance/overall-engagement')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserPerformanceResponse,
  })
  async getPerformanceInUserProfile(
    @Param('userId') userId: number,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getUserPerformance(userId, caregiverId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/performance/physical-activities')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserPhysicalPerformanceResponse,
  })
  async getPhysicalActivitiesPerformance(
    @Param('userId') userId: number,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getPhysicalActivityPerformance(userId, caregiverId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/performance/cognitive-games-engagement')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetGamesEngagementResponseDto,
  })
  async getCognitiveGamesEngagementPerformance(
    @Param('userId') userId: number,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getCognitiveGamesEngagement(caregiverId, null, userId);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/supporting-contact/assign/informal-caregiver/:caregiverId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: AssignInformalCaregiverAsSupportingContactToSeniorResponse,
  })
  async assignInformalCaregiverAsSupportingContactToSenior(
    @Param('userId', ParseIntPipe) seniorId: number,
    @Param('caregiverId', ParseIntPipe) caregiverId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.assignInformalCaregiverAsSupportingContactToSenior(
      userId,
      caregiverId,
      seniorId,
    );
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/supporting-contact')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddSupportingContactResponseDto,
  })
  async addSupportingContact(
    @Param('userId') seniorId: number,
    @Body() addSupportingContactDto: AddSupportingContactDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.addEmergencyContact(
      caregiverId,
      addSupportingContactDto,
      seniorId,
      EContactType.SUPPORTING,
    );
    return res.status(result.status).send(result);
  }

  @Patch('users/:userId/supporting-contact/:contactId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateSupportingContactResponseDto,
  })
  async updateSupportingContact(
    @Param('userId') seniorId: number,
    @Param('contactId') contactId: number,
    @Body() updateSupportingContactDto: AddSupportingContactDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.updateEmergencyContact(
      userId,
      seniorId,
      contactId,
      updateSupportingContactDto,
      EContactType.SUPPORTING,
    );
    return res.status(result.status).send(result);
  }

  @Delete('users/:userId/supporting-contact/:contactId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteSupportingContactResponseDto,
  })
  async deleteSupportingContact(
    @Req() { user: { userId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Param('contactId') contactId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.deleteSupportingContact(
      userId,
      seniorId,
      contactId,
      EContactType.SUPPORTING,
    );
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/supporting-contact')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetSupportingContactResponseDto,
  })
  async getSupportingContact(
    @Req() { user: { userId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getEmergencyContacts(userId, seniorId, EContactType.SUPPORTING);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/family-doctor')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddFamilyDoctorResponseDto,
  })
  async addFamilyDoctor(
    @Param('userId') seniorId: number,
    @Body() addFamilyDoctorDto: AddFamilyDoctorDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.addEmergencyContact(
      userId,
      addFamilyDoctorDto,
      seniorId,
      EContactType.DOCTOR,
    );
    return res.status(result.status).send(result);
  }

  @Patch('users/:userId/family-doctor/:contactId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateFamilyDoctorResponseDto,
  })
  async updateFamilyDoctor(
    @Param('userId') seniorId: number,
    @Param('contactId') contactId: number,
    @Body() updateFamilyDoctorDto: AddFamilyDoctorDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.updateEmergencyContact(
      userId,
      seniorId,
      contactId,
      updateFamilyDoctorDto,
      EContactType.DOCTOR,
    );
    return res.status(result.status).send(result);
  }

  @Delete('users/:userId/family-doctor/:contactId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteFamilyDoctorContactResponseDto,
  })
  async deleteFamilyDoctorContact(
    @Req() { user: { userId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Param('contactId') contactId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.deleteSupportingContact(
      userId,
      seniorId,
      contactId,
      EContactType.DOCTOR,
    );
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/family-doctor')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetFamilyDoctorResponseDto,
  })
  async getFamilyDoctor(
    @Req() { user: { userId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getEmergencyContacts(userId, seniorId, EContactType.DOCTOR);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/personal-details')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetPersonalDetailsResponseDto,
  })
  async getPersonalDetails(
    @Param('userId') seniorId: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getPersonalDetails(userId, seniorId);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/assessments/:assessmentId/additional-info')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: AddAdditionalInfoResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        notes: {
          type: 'string',
        },
      },
    },
  })
  async addAdditionalInfo(
    @Req() { user: { userId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Param('assessmentId') assessmentId: number,
    @Res() res: Response,
    @Body() notes?: { notes: string },
    @UploadedFiles(new FilesValidationPipe(true)) files?: FileArray,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.addAdditionalInfo(userId, seniorId, assessmentId, files, notes);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/assessments')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: AddUserAssessmentResponseDto,
  })
  async addUserAssessment(
    @Req() { user: { userId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Body() addUserAssessmentDto: AddUserAssessmentDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.addUserAssessment(userId, seniorId, addUserAssessmentDto);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/assessments/scores')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserAssessmentScoreResponseDto,
  })
  async getUserAssessmentScores(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Res() res: Response,
    @Query('area', GetAssessmentScoreByAreaValidationPipe) area?: EUserAssessmentAreas,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getUserAssessmentScores(caregiverId, seniorId, area);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/assessments/scores/mobility-level')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserMobilityLevelResponseDto,
  })
  async getUserAssessmentScoresMobilityLevel(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') seniorId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getMobilityLevel(caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('user-form/:userId/:formType/steps')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetAddSeniorFormStepsDto,
  })
  async getSeniorFormSteps(
    @Param('userId') seniorId: number,
    @Param('formType', SeniorFormTypeValidationPipe) formType: ESeniorFormType,
    @Res() res: Response,
  ): Promise<Response<GetAddSeniorFormStepsDto>> {
    const result = await this.caregiverService.getSeniorFormSteps(seniorId, formType);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/user-form/:formType/steps/:step')
  @Roles(ERole.SUPER_ADMIN_INSTITUTION, ERole.ADMIN_INSTITUTION, ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateOnboardingStepsResponseDto,
  })
  async updateAddSeniorFormSteps(
    @Res() res: Response,
    @Param('step') step: number,
    @Param('userId') seniorId: number,
    @Param('formType', SeniorFormTypeValidationPipe) formType: ESeniorFormType,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.updateAddSeniorFormSteps(step, seniorId, formType);
    return res.status(result.status).send(result);
  }

  @Get('notifications/settings')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetNotificationSettingsResponseDto,
  })
  async getNotificationSettings(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notificationService.getNotificationSettings(caregiverId);
    return res.status(result.status).send(result);
  }

  @Patch('notifications/settings')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: PatchNotificationSettingsResponseDto,
  })
  async updateNotificationSettings(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Body() notificationSettings: UpdateNotificationSettingsDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notificationService.updateNotificationSettings(caregiverId, notificationSettings);
    return res.status(result.status).send(result);
  }

  @Get('notifications/my')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiPaginatedResponse(GetMyNotificationsDto, FilterMyNotificationsDto)
  async getMyNotifications(
    @Query() filterDto: GetMyNotificationsFilterDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notificationService.getMyNotifications(caregiverId, filterDto);
    return res.status(result.status).send(result);
  }

  @Put('notifications/mark-as-read')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: MarkNotificationAsADisplayedResponseDto,
  })
  async markNotificationsAsRead(
    @Req() { user: { userId } }: TUserReq,
    @Query('notificationIds', new ParseArrayPipe({ items: Number, separator: ',' })) notificationIds: number[],
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notificationService.markNotificationsAsRead(userId, notificationIds);
    return res.status(result.status).send(result);
  }

  @Get('notifications/unread/count')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUnreadNotificationCountResponseDto,
  })
  async getUnreadNotificationCount(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.notificationService.getUnreadNotificationCount(caregiverId);
    return res.status(result.status).send(result);
  }

  @Get('users/qr-code')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetQrCodeResponseDto,
  })
  async generateQRCode(@Res() res: Response): Promise<Response<TResponse<string>>> {
    const result = await this.caregiverService.getQrCode();
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/schedule')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserScheduleResponse,
  })
  async getUserSchedule(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.getUserSchedule(caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Patch('users/:userId/schedule/bedridden')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateCustomScheduleResponseDto,
  })
  async updateCustomScheduleBedridden(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Body() updateCustomScheduleBedridden: ScheduleBedriddenDto,
    @Res() res: Response,
    @Param('userId') seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.updateCustomScheduleBedridden(
      caregiverId,
      seniorId,
      updateCustomScheduleBedridden,
    );
    return res.status(result.status).send(result);
  }

  @Patch('users/:userId/schedule/mobility-limitations')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateCustomScheduleResponseDto,
  })
  async updateCustomScheduleMobilityLimitations(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Body() scheduleMobilityLimitations: ScheduleMobilityLimitationsDto,
    @Res() res: Response,
    @Param('userId') seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.updateCustomScheduleMobilityLimitations(
      caregiverId,
      seniorId,
      scheduleMobilityLimitations,
    );
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/schedule/generate')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetGeneratedSchedulesResponseDto,
  })
  async generateSchedules(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.generateSchedules(caregiverId, userId);
    return res.status(result.status).send(result);
  }

  @Patch('users/:userId/schedule/no-limitations')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UpdateCustomScheduleResponseDto,
  })
  async updateCustomScheduleNoLimitations(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Body() updateCustomScheduleNoLimitationsDto: ScheduleNoLimitationsDto,
    @Res() res: Response,
    @Param('userId') seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.updateCustomScheduleNoLimitations(
      caregiverId,
      seniorId,
      updateCustomScheduleNoLimitationsDto,
    );
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/schedule/:activityLevel')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: AddCustomScheduleResponseDto,
  })
  @ApiQuery({
    name: 'personalGrowth',
    required: false,
  })
  async saveSchedule(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
    @Param('activityLevel', ActivityLevelValidationPipe) activityLevel: EActivityLevel,
    @Body() schedules: TResponse<TGeneratedSchedules>,
    @Query('personalGrowth', PersonalGrowthValidationPipe) personal_growth?: EPersonalGrowth,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.saveSchedule(
      caregiverId,
      seniorId,
      schedules,
      activityLevel,
      personal_growth,
    );
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/security-code')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetSecurityCodeResponseDto,
  })
  async getSecurityCode(
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getSecurityCode(userId, seniorId);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/documents')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: UploadSeniorDocumentsResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  async uploadSeniorDocuments(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
    @UploadedFiles(new FilesValidationPipe()) files: SeniorDocumentsFilesArray,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.uploadSeniorDocuments(caregiverId, seniorId, files);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/documents/view')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: ViewDocumentsResponseDto,
  })
  async viewDocuments(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.viewDocuments(caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/documents/:documentId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DownloadSeniorDocumentsResponseDto,
  })
  async getSeniorDocument(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
    @I18n() i18n: I18nContext,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getSeniorDocument(caregiverId, seniorId, documentId);

    if (result.status !== HttpStatus.OK) {
      return res.status(result.status).send(result);
    }

    const details = result.details as { buffer: Buffer; filename: string };

    if (!details || !details.buffer || !details.filename) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(
          i18n.t(
            `${TAdminCaregiverResponseKey}.service.GET_SENIOR_DOCUMENT.failed_to_get_document.notification.message`,
          ),
        );
    }

    res.setHeader('Content-Disposition', `attachment; filename=${details.filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    return res.status(HttpStatus.OK).send(details.buffer);
  }

  @Delete('users/:userId/documents/:documentId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteSeniorDocumentResponseDto,
  })
  async deleteSeniorDocument(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
    @Param('documentId', ParseIntPipe) documentId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.deleteSeniorDocument(caregiverId, seniorId, documentId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/documents')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiPaginatedResponse(GetDocumentsDto)
  async getDocuments(
    @Query() filterDto: GetDocumentsFilterDto,
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getDocuments(caregiverId, seniorId, filterDto);
    return res.status(result.status).send(result);
  }

  @Get('users/dashboards/games-engagement')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetGamesEngagementResponseDto,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
  })
  async getCognitiveGamesEngagement(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Query() paginationParams: NestedPaginationParamsDto,
    @Query('userId') seniorId?: number,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getCognitiveGamesEngagement(caregiverId, paginationParams, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('users/dashboards/most-active-users')
  @Roles(ERole.FORMAL_CAREGIVER)
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
      this.caregiverRetrievalStrategy,
    );
    return res.status(result.status).send(result);
  }

  @Post('informal-caregiver/exist')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: CheckIfInformalCaregiverExistsResponseDto,
  })
  async checkIfInformalCaregiverExists(
    @Body() dto: CheckIfInformalCaregiverExistsDto,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.checkIfInformalCaregiverExists(userId, dto);
    return res.status(result.status).send(result);
  }

  @Get('users/dashboards/institution-view')
  @Roles(ERole.ADMIN_INSTITUTION)
  @ApiOkResponse({
    description: 'OK',
    type: GetDashboardInstitutionViewResponse,
  })
  @ApiQuery({
    required: false,
    name: 'sortOrder',
    enum: ESortOrder,
  })
  async getDashboardInsitutionView(
    @Res() res: Response,
    @Req() { user: { userId } }: TUserReq,
    @Query('sortOrder', SortOrderValidationPipe) sortOrder?: ESortOrder,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getDashboardInsitutionView(userId, sortOrder);
    return res.status(result.status).send(result);
  }

  @Get('users/dashboards/user-performance')
  @Roles(ERole.INFORMAL_CAREGIVER, ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetUserPerformanceResponse,
  })
  async getUserPerformance(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Query('userId') seniorId?: number,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.getUserPerformance(seniorId, caregiverId);
    return res.status(result.status).send(result);
  }

  @Put('users/:userId/schedule/care-plan-reason')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: EditCarePlanReasonResponse,
  })
  async editCarePlanReason(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
    @Body() editCarePlanReasonDto: EditCarePlanReasonDto,
  ): Promise<Response<TResponse>> {
    const result = await this.dashboardsService.editCarePlanReason(caregiverId, seniorId, editCarePlanReasonDto);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/landing-page')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: SendLandingPageLinkViaEmailResponseDto,
  })
  async sendLandingPageLinkViaEmail(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.sendLandingPageLinkViaEmail(caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/schedule/walking-time')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetWalkingTimeResponseDto,
  })
  async getWalkingTime(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.schedulesService.getWalkingTime(caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/assessments/:assessmentId/report')
  @Roles(ERole.FORMAL_CAREGIVER)
  async getUserAssessmentReport(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('assessmentId', ParseIntPipe) assessmentId: number,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getUserAssessmentReport(caregiverId, seniorId, assessmentId);

    if (result.status !== HttpStatus.OK) {
      return res.status(result.status).json(result);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assessment.pdf');
    return res.status(result.status).send(result.details);
  }

  @Delete('users/:userId')
  @Roles(ERole.FORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: DeleteUserResponseDto,
  })
  async deleteUser(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.deleteUser(caregiverId, seniorId);
    return res.status(result.status).send(result);
  }

  @Get('formal-caregivers/:id')
  @Roles(ERole.FORMAL_CAREGIVER, ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: GetFormalCaregiverByIdResponseDto,
  })
  async getFormalCaregiver(
    @Param('id') id: number,
    @Req() { user: { userId } }: TUserReq,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.getFormalCaregiver(id, userId);
    return res.status(result.status).send(result);
  }

  @Get('users/:userId/performance-warning')
  @Roles(ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: CheckIsANeedDisplayUserPerformanceWarningResponseDto,
  })
  async isANeedDisplayPerformanceWarning(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.isANeedDisplayPerformanceWarning(seniorId, caregiverId);
    return res.status(result.status).send(result);
  }

  @Post('users/:userId/performance-warning/send')
  @Roles(ERole.INFORMAL_CAREGIVER)
  @ApiOkResponse({
    description: 'OK',
    type: SendPerformanceWarningResponseDto,
  })
  async sendPerformanceWarningNotification(
    @Req() { user: { userId: caregiverId } }: TUserReq,
    @Res() res: Response,
    @Param('userId', ParseIntPipe) seniorId: number,
  ): Promise<Response<TResponse>> {
    const result = await this.caregiverService.sendPerformanceWarningNotification(seniorId, caregiverId);
    return res.status(result.status).send(result);
  }
}
