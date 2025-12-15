import { ERole } from '../types';
import { ECaregiverRole } from '../caregiver/types';

export class RoleDto {
  id: number;
  role_name: ERole;
}
export class CaregiverRoleDto {
  id: number;
  role_name: ECaregiverRole;
}
