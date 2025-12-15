import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EDifficultyLevel } from '../types';

@Entity({ name: 'tic_tac_toe' })
export class TicTacToe {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: EDifficultyLevel,
  })
  difficulty_level: EDifficultyLevel;

  @Column()
  number_of_games_to_play: number;

  @Column()
  number_of_games_to_win: number;

  @Column()
  computer_behaviour: string;

  @Column()
  number_of_fields: number;

  @Column()
  number_of_figures_in_one_line_to_win: number;
}
