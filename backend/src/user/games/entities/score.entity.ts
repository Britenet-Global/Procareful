import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EDifficultyLevel, EGame } from '../types';

@Entity({ name: 'scores' })
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  completion_time: number;

  @Column({ nullable: true })
  number_of_tries: number;

  @Column({ nullable: true })
  number_of_hints_used: number;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  number_of_wins: number;

  @Column({ nullable: true })
  snake_length: number;

  @Column({ nullable: true })
  number_of_hearts_used: number;

  @Column()
  completed: boolean;

  @Column({
    type: 'enum',
    enum: EGame,
  })
  game_name: EGame;

  @Column({
    type: 'enum',
    enum: EDifficultyLevel,
  })
  game_level: EDifficultyLevel;

  @ManyToOne(() => User, (user) => user.scores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
