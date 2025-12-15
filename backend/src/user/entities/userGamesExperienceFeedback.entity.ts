import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EGameExperienceFeedback } from '../types';
import { UserGamesFeedback } from './userGamesFeedback.entity';

@Entity({ name: 'user_games_experience_feedback' })
export class UserGamesExperienceFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EGameExperienceFeedback,
  })
  feedback: EGameExperienceFeedback;

  @ManyToMany(() => UserGamesFeedback, (user_games_feedback) => user_games_feedback.user_games_experience_feedback)
  user_games_feedback: UserGamesFeedback[];
}
