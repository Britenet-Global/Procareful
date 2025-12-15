import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ERole } from '../types';
import { Admin } from '.';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ERole,
  })
  role_name: ERole;

  @ManyToMany(() => Admin, (admin) => admin.roles)
  admins: Admin[];
}
