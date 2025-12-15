import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EStatus } from '../types';
import { Admin, Institution } from '.';

@Entity({ name: 'statuses' })
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EStatus,
  })
  status_name: EStatus;

  @OneToMany(() => Admin, (admin) => admin.status)
  admins: Admin[];

  @OneToMany(() => Institution, (institution) => institution.status)
  institutions: Institution[];
}
