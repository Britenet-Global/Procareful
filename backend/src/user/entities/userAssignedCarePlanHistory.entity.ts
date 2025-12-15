import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { EActivityLevel, EUserPhysicalActivityGroup, EWalkingLevel } from 'src/admin/caregiver/types';

@Entity({ name: 'user_assigned_care_plan_history' })
export class UserAssignedCarePlanHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ nullable: true })
  number_of_physical_exercises: number;

  @Column({ nullable: true })
  number_of_breathing_activities: number;

  @Column()
  walking_exercise: boolean;

  @Column()
  personal_growth: boolean;

  @Column({ type: 'enum', enum: EActivityLevel })
  physical_activities_intensity: EActivityLevel;

  @Column({ type: 'enum', enum: EActivityLevel })
  breathing_activities_intensity: EActivityLevel;

  @Column({ type: 'enum', enum: EWalkingLevel, nullable: true })
  walking_level: EWalkingLevel | null;

  @Column({ type: 'enum', enum: EUserPhysicalActivityGroup })
  activity_group: EUserPhysicalActivityGroup;

  @ManyToOne(() => User, (user) => user.planHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
