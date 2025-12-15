import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EDifficultyLevel } from '../types';

@Entity({ name: 'sudoku' })
export class Sudoku {
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
  number_of_squares: number;
}
