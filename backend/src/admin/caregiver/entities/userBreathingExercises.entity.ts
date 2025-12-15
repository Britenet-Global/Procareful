import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EBreathingExercisePosition, EBreathingExerciseType } from '../types';
import { UserActivities } from './userActivities.entity';
import { Video } from '../../../user/video/entities/video.entity';

@Entity({ name: 'user_breathing_exercises' })
export class UserBreathingExercises {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'enum', enum: EBreathingExerciseType })
  name: EBreathingExerciseType;

  @Column({ type: 'enum', enum: EBreathingExercisePosition })
  position: EBreathingExercisePosition;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => UserActivities, (activities) => activities.user_breathing_exercises)
  activities: UserActivities;

  @OneToOne(() => Video, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
