import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EDifficultyLevel } from '../types';

@Entity({ name: 'game_2048' })
export class Game2048 {
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
  start_number: number;

  @Column()
  end_number: number;

  @Column()
  size_of_field: number;
}
