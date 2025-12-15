import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from '../../admin/entities';

@Entity({ name: 'notification_settings' })
export class NotificationSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ default: true })
  performance_decline_in_app: boolean;

  @Column({ default: true })
  performance_decline_email: boolean;

  @Column({ default: true })
  user_inactive_7_days_in_app: boolean;

  @Column({ default: true })
  user_inactive_7_days_email: boolean;

  @Column({ default: true, nullable: true })
  monitoring_visit_in_app: boolean;

  @Column({ default: true, nullable: true })
  monitoring_visit_email: boolean;

  @Column({ default: true, nullable: true })
  new_senior_in_app: boolean;

  @Column({ default: true, nullable: true })
  new_senior_email: boolean;

  @Column({ default: false, nullable: true })
  new_FC_assigned_in_app: boolean;

  @Column({ default: false, nullable: true })
  new_FC_assigned_email: boolean;

  @Column({ default: false, nullable: true })
  new_IC_assigned_in_app: boolean;

  @Column({ default: false, nullable: true })
  new_IC_assigned_email: boolean;

  @Column({ default: false })
  user_completed_assignment_in_app: boolean;

  @Column({ default: false })
  user_completed_assignment_email: boolean;

  @Column({ default: false })
  new_note_in_app: boolean;

  @Column({ default: false })
  new_note_email: boolean;

  @Column({ default: false, nullable: true })
  new_document_in_app: boolean;

  @Column({ default: false, nullable: true })
  new_document_email: boolean;

  @Column({ default: false })
  new_care_plan_in_app: boolean;

  @Column({ default: false })
  new_care_plan_email: boolean;
}
