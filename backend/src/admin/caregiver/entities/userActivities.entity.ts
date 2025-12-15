import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EActivityLevel } from '../types';
import { UserPhysicalExercises } from './userPhysicalExercises.entity';
import { UserBreathingExercises } from './userBreathingExercises.entity';
import { UserWalkingExercises } from './userWalkingExercises.entity';
import { EPersonalGrowth } from '../schedules/types';
import { UserPhysicalActivitiesScores } from 'src/user/entities/userPhysicalActivitiesScores.entity';
import { UserPersonalGrowth } from '../../../user/entities/userPersonalGrowth.entity';
import { UserGamesFeedback } from 'src/user/entities/userGamesFeedback.entity';

@Entity({ name: 'user_activities' })
export class UserActivities {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToMany(() => UserPhysicalExercises, (user_physical_exercises) => user_physical_exercises.activities, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    joinColumn: { name: 'user_activities_id' },
    inverseJoinColumn: { name: 'user_physical_exercises_id' },
  })
  user_physical_exercises: UserPhysicalExercises[];

  @ManyToMany(() => UserBreathingExercises, (user_breathing_exercises) => user_breathing_exercises.activities, {
    onDelete: 'CASCADE',
  })
  @JoinTable({ joinColumn: { name: 'user_activities_id' }, inverseJoinColumn: { name: 'user_breathing_exercises_id' } })
  user_breathing_exercises: UserBreathingExercises[];

  @Column({
    type: 'enum',
    enum: EActivityLevel,
  })
  breathing_level: EActivityLevel;

  @Column({
    type: 'enum',
    enum: EActivityLevel,
  })
  physical_level: EActivityLevel;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserWalkingExercises, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_walking_exercises_id' })
  user_walking_exercises: UserWalkingExercises;

  @Column({ type: 'enum', enum: EPersonalGrowth, nullable: true })
  personal_growth: EPersonalGrowth;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @OneToMany(() => UserPhysicalActivitiesScores, (score) => score.userActivities, { onDelete: 'CASCADE' })
  user_physical_activities_scores: UserPhysicalActivitiesScores[];

  @OneToMany(() => UserPersonalGrowth, (growth) => growth.userActivities, { onDelete: 'CASCADE' })
  user_personal_growth: UserPersonalGrowth[];

  @OneToMany(() => UserGamesFeedback, (feedback) => feedback.userActivities, { onDelete: 'CASCADE' })
  user_games_feedback: UserGamesFeedback[];

  @BeforeInsert()
  setStartDateOnCreate(): void {
    this.start_date = new Date();
  }

  @BeforeUpdate()
  setStartDateOnUpdate(): void {
    const today = new Date();
    today.setDate(today.getDate());
    today.setHours(23, 59, 59, 999);
    this.start_date = today;
  }
}
