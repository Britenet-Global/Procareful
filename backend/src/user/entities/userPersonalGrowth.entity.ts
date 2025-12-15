import { UserActivities } from 'src/admin/caregiver/entities/userActivities.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { EPersonalRate } from '../types';
import { UserPersonalGrowthChallenges } from './userPersonalGrowthChallenges.entity';

@Entity({ name: 'user_personal_growth' })
export class UserPersonalGrowth {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  active: boolean;

  @Column({
    type: 'enum',
    enum: EPersonalRate,
    nullable: true,
  })
  personal_rate?: EPersonalRate;

  @Column({ length: 256, nullable: true })
  stuck_in_memory_the_most?: string;

  @Column({ length: 256, nullable: true })
  positive_emotions?: string;

  @ManyToOne(() => UserActivities, (userActivities) => userActivities.user_personal_growth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_activities_id' })
  userActivities: UserActivities;

  @ManyToOne(() => UserPersonalGrowthChallenges, (userPersonalGrowthChallenges) => userPersonalGrowthChallenges.id)
  @JoinColumn({ name: 'user_personal_growth_challenges_id' })
  user_personal_growth_challenges: UserPersonalGrowthChallenges;
}
