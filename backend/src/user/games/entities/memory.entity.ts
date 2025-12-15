import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EDifficultyLevel } from '../types';

@Entity({ name: 'memory' })
export class Memory {
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
  number_of_cards_to_pair: number;

  @Column()
  complexity_of_cards: string;

  @Column()
  expected_number_of_tries: number;

  @Column()
  number_of_hints: number;

  @Column()
  complexity_level: number;
}
