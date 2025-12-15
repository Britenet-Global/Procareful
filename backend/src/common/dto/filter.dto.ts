import { EStatus } from '../../admin/types';
import { ECaregiverRole } from '../../admin/caregiver/types';
import { ApiProperty } from '@nestjs/swagger';
import { ENotificationPriority, ENotificationTitle } from 'src/notifications/types';
import { ENoteCategory } from 'src/notes/types';

export class FilterDto {
  @ApiProperty()
  status: {
    status_name: EStatus;
  };
}

export class FilterCaregiverDto {
  @ApiProperty()
  status: {
    status_name: EStatus;
  };
  @ApiProperty()
  caregiver_roles: {
    role_name: ECaregiverRole;
  };
}

export class FilterMyNotificationsDto {
  @ApiProperty()
  priority: ENotificationPriority;

  @ApiProperty()
  title: ENotificationTitle;

  @ApiProperty()
  user: {
    id: number;
  };
}

export class FilterNotesDto {
  @ApiProperty()
  priority: boolean;

  @ApiProperty()
  author: {
    id: number;
  };

  @ApiProperty()
  category: {
    category_name: ENoteCategory;
  };
}
