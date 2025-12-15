import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EDifficultyLevel } from '../types';

@Entity({ name: 'wordle' })
export class Wordle {
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
  number_of_chances: number;

  @Column()
  number_of_hints: number;
}
