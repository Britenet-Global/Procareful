import { EStatus } from '../../types';
import { RoleDto } from '../../dto';

export class AdminWithoutStatusAndRoles {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth?: string;
  deleted_at: Date;
  image_name: string;
}
export class AdminWithoutStatus extends AdminWithoutStatusAndRoles {
  roles: RoleDto[];
}

export class AdminBasicInfo extends AdminWithoutStatus {
  status: {
    id: number;
    status_name: EStatus;
  };
}
