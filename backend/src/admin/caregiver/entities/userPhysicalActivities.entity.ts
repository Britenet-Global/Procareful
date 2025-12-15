import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Check, OneToOne } from 'typeorm';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_physical_activities' })
export class UserPhysicalActivities {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currently_bedridden: boolean;

  @Column()
  can_walk_without_support: boolean;

  @Column()
  severe_balance_problems: boolean;

  @Column({ nullable: true })
  @Check('vigorous_activity_days_last_week >= 0 AND vigorous_activity_days_last_week <= 7')
  vigorous_activity_days_last_week: number;

  @Column({ nullable: true })
  @Check('vigorous_activity_minutes_per_day >= 0 AND vigorous_activity_minutes_per_day <= 1440')
  vigorous_activity_minutes_per_day: number;

  @Column({ nullable: true })
  @Check('moderate_activity_days_last_week >= 0 AND moderate_activity_days_last_week <= 7')
  moderate_activity_days_last_week: number;

  @Column({ nullable: true })
  @Check('moderate_activity_minutes_per_day >= 0 AND moderate_activity_minutes_per_day <= 1440')
  moderate_activity_minutes_per_day: number;

  @Column({ nullable: true })
  @Check('walking_days_last_week >= 0 AND walking_days_last_week <= 7')
  walking_days_last_week: number;

  @Column({ nullable: true })
  @Check('walking_minutes_per_day >= 0 AND walking_minutes_per_day <= 1440')
  walking_minutes_per_day: number;

  @Column({ nullable: true })
  @Check('time_sitting_last_week >= 0 AND time_sitting_last_week <= 1440')
  time_sitting_last_week: number;

  @ManyToOne(() => User, (user) => user.user_physical_activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserAssessment, (assessment) => assessment.user_physical_activities, { onDelete: 'CASCADE' })
  assessment: UserAssessment;
}
