import { ApiProperty } from '@nestjs/swagger';
import { AdminWithoutStatusAndRoles } from 'src/admin/admin-institution/dto/get-admin-basic-info.dto';
import {
  GetDashboardInstitutionViewDto,
  GetEmergencyContactsDto,
  GetFamilyDoctorDto,
  GetFormalCaregiverByIdDto,
  GetInformalCaregiverExists,
  GetMostActiveUsersDto,
  GetUserMobilityLevel,
  GetUserPerformance,
} from '.';
import { NotificationDto } from '../../../common/dto';
import { TResponseDetails } from '../../../common/types';
import { AddNewUserIdResponseDto } from './add-user.dto';
import { GenerateSchedulesDto } from './generate-schedules.dto';
import { GetNotesDto, GetNoteWithFlagDto } from './get-notes.dto';
import { GetUserAssessmentScore } from './get-user-assessment-score.dto';
import { GetUserInfoDto, GetUsersForCaregiverWithImageDto } from './get-user.dto';
import { GetSupportingContactDto } from './supporting-contact.dto';
import { GetWalkingTime } from '../schedules/dto';
import { GetUserPhysicalPerformanceDto } from '../dashboards/dto/get-user-physical-performance.dto';
import { GetUserProfilePerformanceDto } from '../dashboards/dto/get-user-profile-performance.dto';

export class AddUserResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User added');

  @ApiProperty()
  details: AddNewUserIdResponseDto;
}
export class AddUserAddressResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Address updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetUserInfoResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User fetched');

  @ApiProperty()
  details: GetUserInfoDto;
}
export class GetUserIdResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User fetched');

  @ApiProperty()
  details: number;
}
export class GetUsersForCaregiverResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Users fetched');

  @ApiProperty()
  details: GetUsersForCaregiverWithImageDto[];
}
export class UpdateContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Data updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DeleteNoteResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Note deleted.');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class GetNotesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Notes fetched');

  @ApiProperty()
  details: GetNotesDto[];
}
export class AddNoteResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('New note added');

  @ApiProperty()
  details: number;
}

export class GetNoteResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Note fetched');

  @ApiProperty()
  details: GetNoteWithFlagDto;
}

export class UpdateNoteResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Note updated.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetNoteAuthorsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Note authors fetched');

  @ApiProperty()
  details: AdminWithoutStatusAndRoles[];
}

export class AddFamilyDoctorResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('The family doctor added as a user contact');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class GetUserPhysicalPerformanceResponse {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User performance in %');

  @ApiProperty()
  details: GetUserPhysicalPerformanceDto;
}
export class GetUserProfilePerformanceResponse {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User performance fetched');

  @ApiProperty()
  details: GetUserProfilePerformanceDto;
}

export class AssignInformalCaregiverAsSupportingContactToSeniorResponse {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Assigned informal caregiver to the senior');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class AddSupportingContactResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Supporting contact added as a user contact');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class GetFamilyDoctorResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Family doctors fetched');

  @ApiProperty()
  details: GetFamilyDoctorDto[];
}
export class GetSupportingContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Family doctors fetched');

  @ApiProperty()
  details: GetSupportingContactDto[];
}
export class UpdateFamilyDoctorResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('The family doctor updated');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class UpdateSupportingContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Supporting contact updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetEmergencyContactsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Emergency contacts fetched.');

  @ApiProperty()
  details: GetEmergencyContactsDto;
}

export class GetPersonalDetailsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Personal details fetched.');

  @ApiProperty()
  details: {
    basicInfo: GetUserInfoDto;
    emergencyContacts: GetEmergencyContactsDto[];
    familyDoctor: GetFamilyDoctorDto[];
    userImage: string;
  };
}

export class DeleteEmergencyContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Emergency contact deleted.');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class DeleteFamilyDoctorContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Family doctor contact deleted.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DeleteSupportingContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Supporting contact deleted.');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class AddAdditionalInfoResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Additional info added.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UpdateFamilyDoctorContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Family doctor contact updated.');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class GetUserAssessmentScoreResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto(`User's assessment score fetched.`);

  @ApiProperty()
  details: GetUserAssessmentScore;
}

export class GetUserMobilityLevelResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto(`User's mobility level fetched.`);

  @ApiProperty()
  details: GetUserMobilityLevel;
}
export class AddUserAssessmentResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User Assessment added.');

  @ApiProperty()
  details: { userAssessmentId: number };
}
export class GetGeneratedSchedulesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Three types of schedules generated');

  @ApiProperty()
  details: GenerateSchedulesDto;
}

export class GetMostActiveUsersResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Users fetched');

  @ApiProperty()
  details: GetMostActiveUsersDto[];
}

export class CheckIfInformalCaregiverExistsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal caregiver found');

  @ApiProperty()
  details: GetInformalCaregiverExists | null;
}

export class GetDashboardInstitutionViewResponse {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Dashboard fetched');

  @ApiProperty()
  details: GetDashboardInstitutionViewDto;
}

export class GetUserPerformanceResponse {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User performance fetched');

  @ApiProperty()
  details: GetUserPerformance;
}

export class EditCarePlanReasonResponse {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Edit care plan reason updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class SendLandingPageLinkViaEmailResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Email sent');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetWalkingTimeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Walking time fetched');

  @ApiProperty()
  details: GetWalkingTime;
}

export class DownloadNoteAttachmentResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Attachment fetched.');

  @ApiProperty()
  details: string;
}

export class GetFormalCaregiverByIdResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Formal caregiver fetched');

  @ApiProperty()
  details: GetFormalCaregiverByIdDto;
}

export class CheckIsANeedDisplayUserPerformanceWarningResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Need checked');

  @ApiProperty()
  details: boolean;
}

export class SendPerformanceWarningResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Performance warning send');

  @ApiProperty()
  details: TResponseDetails = null;
}
