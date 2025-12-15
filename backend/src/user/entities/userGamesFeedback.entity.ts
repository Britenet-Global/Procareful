import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EFeedbackType, EPersonalRate } from '../types';
import { UserActivities } from 'src/admin/caregiver/entities/userActivities.entity';
import { UserGamesExperienceFeedback } from './userGamesExperienceFeedback.entity';
import { UserDifficultyFeedback } from './userDifficultyFeedback.entity';
import { EGame } from '../games/types';

@Entity({ name: 'user_games_feedback' })
export class UserGamesFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: EGame,
  })
  game_name: EGame;

  @Column({
    type: 'enum',
    enum: EFeedbackType,
    nullable: true,
  })
  feedback_type: EFeedbackType;

  @Column({
    type: 'enum',
    enum: EPersonalRate,
    nullable: true,
  })
  rating?: EPersonalRate;

  @ManyToMany(
    () => UserGamesExperienceFeedback,
    (user_games_experience_feedback) => user_games_experience_feedback.user_games_feedback,
    { nullable: true },
  )
  @JoinTable({
    name: 'user_games_feedback_user_games_experience_feedback',
    joinColumn: {
      name: 'user_games_feedback_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_games_experience_feedback_id',
      referencedColumnName: 'id',
    },
  })
  user_games_experience_feedback: UserGamesExperienceFeedback[];

  @ManyToMany(
    () => UserDifficultyFeedback,
    (user_difficulty_feedback) => user_difficulty_feedback.user_games_feedback,
    { nullable: true },
  )
  @JoinTable({
    name: 'user_games_feedback_user_difficulty_feedback',
    joinColumn: {
      name: 'user_games_feedback_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_difficulty_feedback_id',
      referencedColumnName: 'id',
    },
  })
  user_difficulty_feedback: UserDifficultyFeedback[];

  @ManyToOne(() => UserActivities, (userActivities) => userActivities.user_games_feedback, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_activities_id' })
  userActivities: UserActivities;
}
