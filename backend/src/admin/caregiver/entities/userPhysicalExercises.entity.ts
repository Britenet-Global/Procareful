import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserActivities } from './userActivities.entity';
import { EPhysicalExercisePosition, EPhysicalExercises } from '../types';
import { Video } from '../../../user/video/entities/video.entity';

@Entity({ name: 'user_physical_exercises' })
export class UserPhysicalExercises {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: EPhysicalExercises,
  })
  name: EPhysicalExercises;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EPhysicalExercisePosition })
  position: EPhysicalExercisePosition;

  @ManyToMany(() => UserActivities, (activities) => activities.user_physical_exercises)
  activities: UserActivities[];

  @OneToOne(() => Video, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
