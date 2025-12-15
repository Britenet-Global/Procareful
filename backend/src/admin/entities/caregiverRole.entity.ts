import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from '.';
import { ECaregiverRole } from '../caregiver/types';

@Entity({ name: 'caregiver_roles' })
export class CaregiverRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ECaregiverRole,
  })
  role_name: ECaregiverRole;

  @ManyToMany(() => Admin, (admin) => admin.caregiver_roles)
  admins: Admin[];
}
