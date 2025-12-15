import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EWalkingLevel } from '../types';

@Entity({ name: 'user_walking_exercises' })
export class UserWalkingExercises {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'enum', enum: EWalkingLevel })
  walking_level: EWalkingLevel;

  @Column({ nullable: true })
  time: number;
}
