import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto/api-response.dto';
import { TResponseDetails } from 'src/common/types';
import {
  GetInformalCaregiversFilterDto,
  GetInstitutionAdminDto,
  GetInstitutionDto,
  GetUserDto,
  UpdateInfoDto,
  WorkingHoursDto,
} from '.';
import { GetFormalCaregiverDto } from './get-formal-caregiver.dto';
import { GetOnboardingDto } from './get-onboarding.dto';
import { ECaregiverRole } from '../../caregiver/types';
import { ERole } from 'src/admin/types';
import { SecurityCodeDto, ViewDocumentsDto } from 'src/admin/caregiver/dto';
import { AddInformalCaregiverResDto, GetInformalCaregiverDto } from './get-informal-caregiver.dto';

export class AddInstitutionAdminResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution admin added');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetInstitutionResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution fetched');

  @ApiProperty()
  details: GetInstitutionDto;
}

export class AssignWorkingHoursResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Working hours assigned');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class GetWorkingHoursResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Working hours fetched');

  @ApiProperty()
  details: WorkingHoursDto;
}

export class AddInformalCaregiverResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal caregiver added');

  @ApiProperty()
  details: AddInformalCaregiverResDto;
}

export class GetInformalCaregiversResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal caregivers fetched');

  @ApiProperty()
  details: GetInformalCaregiversFilterDto;
}

export class GetInformalCaregiverResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal caregiver fetched');

  @ApiProperty()
  details: GetInformalCaregiverDto;
}
export class GetFormalCaregiverRolesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Formal caregiver roles fetched');

  @ApiProperty({ enum: ECaregiverRole, isArray: true })
  details: ECaregiverRole;
}

export class UpdateInformalCaregiverInfoResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal Caregiver basic info updated');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class UpdateFormalCaregiverDetailsDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Formal Caregiver details updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UpdateIARolesResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Admin roles updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetFormalCaregiverResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Formal caregiver fetched');

  @ApiProperty()
  details: GetFormalCaregiverDto;
}

export class AddFormalCaregiverResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Formal caregiver added');

  @ApiProperty()
  details: GetInformalCaregiversFilterDto;
}
export class GetInstitutionAdminResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution Admin details');

  @ApiProperty()
  details: GetInstitutionAdminDto;
}

export class GetUserResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User fetched');

  @ApiProperty()
  details: GetUserDto;
}

export class UpdateInfoResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Basic info updated');

  @ApiProperty()
  details: UpdateInfoDto;
}

export class UpdateAdminInstitutionInfoResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Basic info updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UpdateContactResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Contact information updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class EditSeniorsFormalCaregiverResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto("Senior's formal caregiver updated");

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UploadImageResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Image uploaded successfully.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetImageResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Image fetched.');

  @ApiProperty()
  details: string;
}

export class DeleteImageResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Image deleted successfully.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UpdateOnboardingStepsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Onboarding step updated.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetOnboardingStepsDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Onboarding steps fetched.');

  @ApiProperty()
  details: GetOnboardingDto;
}

export class GetOnboardingStepStatusResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Onboarding step status fetched.');

  @ApiProperty()
  details: {
    step1: boolean;
  };
}

export class GetAddSeniorFormStepsDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Add User form steps fetched');

  @ApiProperty()
  details: GetOnboardingDto;
}

export class AssignInformalCaregiverToSeniorResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal caregiver assigned to senior');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class RevokeInformalCaregiverFromSeniorResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Informal caregiver revoked from senior');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DeleteUserResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('User deleted successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class AssignFormalCaregiverToSeniorResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Formal caregiver assigned to senior');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class AddCustomScheduleResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Custom schedule added');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UpdateCustomScheduleResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Custom schedule updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class UploadSeniorDocumentsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Documents successfully uploaded');

  @ApiProperty()
  details: TResponseDetails = null;
}
export class GetSecurityCodeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Security code fetched');

  @ApiProperty()
  details: SecurityCodeDto;
}

export class UpdateFormalCaregiverRoleResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto(`${ERole.ADMIN_INSTITUTION} role added to caregiver`);

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DownloadSeniorDocumentsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Documents successfully downloaded');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DeleteSeniorDocumentResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Documents successfully deleted');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ViewDocumentsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Documents successfully fetched');

  @ApiProperty()
  details: ViewDocumentsDto[];
}
