import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto/api-response.dto';
import { TResponseDetails } from 'src/common/types';
import { GetSuperInsitutionAdminsFilterDto, GetSuperInstitutionAdminDto } from '.';
import { GetInstitutionDto } from '../admin-institution/dto';
export class GetAllInstitutionsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institutions fetched');

  @ApiProperty()
  details: GetInstitutionDto[];
}
export class GetInstitutionResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution fetched');

  @ApiProperty()
  details: GetInstitutionDto;
}

export class AddSuperInstitutionAdminResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Admin and institution created, sent activation link via email.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetSuperInstitutionAdminResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Super Institution Admin details');

  @ApiProperty()
  details: GetSuperInstitutionAdminDto;
}

export class GetSuperInstitutionAdminsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Super Institution Admins');

  @ApiProperty()
  details: GetSuperInsitutionAdminsFilterDto;
}

export class UpdateSuperInstitutionAdminDetailsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Super Institution Admin details updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ChangeInstitutionOwnerResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution admin changed successfully');

  @ApiProperty()
  details: { newOwnerId: number };
}

export class DeactivateInstitutionResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution and all admins deactivated.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ActivateInstitutionResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution and its admins activated successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DeleteInstitutionResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution, all admins and seniors deleted.');

  @ApiProperty()
  details: TResponseDetails = null;
}
