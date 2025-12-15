import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { EEnthusiasmLevel, EFrequency, EPartnerStatus, ESleepQuality } from '../types';
import { User } from '../../../user/entities/user.entity';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_sleep_assessment' })
export class UserSleepAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ length: 256 })
  bed_time: string;

  @Column()
  fall_asleep_duration: number;

  @Column({ length: 256 })
  wake_up_time: string;

  @Column()
  actual_sleep_hours: number;

  @Column({ type: 'enum', enum: EFrequency })
  cannot_sleep_within_30_minutes: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  wake_up_midnight_or_early_morning: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  need_to_use_bathroom: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  cannot_breathe_comfortably: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  cough_or_snore_loudly: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  feel_too_cold: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  feel_too_hot: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  had_bad_dreams: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  have_pain: EFrequency;

  @Column({ nullable: true })
  other_reasons_for_trouble_sleeping: string;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  sleeping_trouble_frequency: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  medicine_for_sleep: EFrequency;

  @Column({ type: 'enum', enum: EFrequency })
  trouble_staying_awake_frequency: EFrequency;

  @Column({ type: 'enum', enum: EEnthusiasmLevel })
  enthusiasm_to_get_things_done: EEnthusiasmLevel;

  @Column({ type: 'enum', enum: ESleepQuality })
  sleep_quality_rating: ESleepQuality;

  @Column({ type: 'enum', enum: EPartnerStatus })
  have_bed_partner_or_room_mate: EPartnerStatus;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  loud_snoring: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  breathing_pause: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  legs_twitching: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  sleep_disorientation: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  feel_too_cold_room_mate: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  feel_too_hot_room_mate: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  had_bad_dreams_room_mate: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  have_pain_room_mate: EFrequency;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  cough_or_snore_loudly_room_mate: EFrequency;

  @Column({ length: 256, nullable: true })
  other_restlessness: string;

  @Column({ type: 'enum', enum: EFrequency, nullable: true })
  trouble_sleeping_frequency_room_mate: EFrequency;

  @ManyToOne(() => User, (user) => user.user_sleep_assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserAssessment, (assessment) => assessment.user_sleep_assessment)
  assessment: UserAssessment;
}
