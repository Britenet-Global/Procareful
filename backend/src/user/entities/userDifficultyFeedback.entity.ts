import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EDifficultyFeedback } from '../types';
import { UserGamesFeedback } from './userGamesFeedback.entity';

@Entity({ name: 'user_difficulty_feedback' })
export class UserDifficultyFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EDifficultyFeedback,
  })
  feedback: EDifficultyFeedback;

  @ManyToMany(() => UserGamesFeedback, (user_games_feedback) => user_games_feedback.user_difficulty_feedback)
  user_games_feedback: UserGamesFeedback[];
}
