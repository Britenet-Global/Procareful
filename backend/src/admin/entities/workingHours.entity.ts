import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Institution } from './institution.entity';
import { EWeekdays } from '../../common/types';
import { Admin } from './admin.entity';

@Entity()
export class WorkingHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Day, (day) => day.workingHours, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'days_id' })
  days: Day[];

  @OneToOne(() => Institution, (institution) => institution.workingHours, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  @OneToOne(() => Admin, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}

@Entity({ name: 'days' })
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EWeekdays })
  name: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @ManyToOne(() => WorkingHours, (workingHours) => workingHours.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'working_hours_id' })
  workingHours: WorkingHours;
}
