import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { EPriority, EProblemsLevel } from '../types';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_quality_of_life' })
export class UserQualityOfLife {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: EPriority,
  })
  motivation: EPriority;

  @Column({
    type: 'enum',
    enum: EProblemsLevel,
  })
  mobility: EProblemsLevel;

  @Column({
    type: 'enum',
    enum: EProblemsLevel,
  })
  self_care: EProblemsLevel;

  @Column({
    type: 'enum',
    enum: EProblemsLevel,
  })
  usual_activities: EProblemsLevel;

  @Column({
    type: 'enum',
    enum: EProblemsLevel,
  })
  pain_discomfort: EProblemsLevel;

  @Column({
    type: 'enum',
    enum: EProblemsLevel,
  })
  anxiety_depression: EProblemsLevel;

  @Column()
  general_health: number;

  @ManyToOne(() => User, (user) => user.user_quality_of_life, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserAssessment, (assessment) => assessment.user_quality_of_life)
  assessment: UserAssessment;
}
