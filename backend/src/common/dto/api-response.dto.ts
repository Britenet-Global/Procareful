import { ApiProperty } from '@nestjs/swagger';
import { TResponseDetails } from '../types';

class DetailsDto {
  field: string;
  error: string;
}

export class BadRequestDto {
  error: string;
  details: DetailsDto[];
}

export class NotificationDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  message?: string;

  constructor(title: string, message?: string) {
    this.title = title;
    this.message = message;
  }
}

export class UpdateInstitutionDetailsResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Institution details updated');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class DeleteAdminResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Admin deleted successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class SetAdminStatusResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Admin status updated successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ResendActivationLinkResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('The activation link has been resent to the admin');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class NestedPagination {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;
}

export class NestedPaginatedResponseDto<T> {
  @ApiProperty({ type: () => [Object] })
  items: T[];

  @ApiProperty({ type: () => NestedPagination })
  pagination: NestedPagination;
}
