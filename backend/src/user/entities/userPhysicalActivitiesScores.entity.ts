import { UserActivities } from 'src/admin/caregiver/entities/userActivities.entity';
import { EExerciseTimeOfDay, EMergedPhysicalExercises } from 'src/admin/caregiver/types';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'user_physical_activities_scores' })
export class UserPhysicalActivitiesScores {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: EMergedPhysicalExercises,
  })
  name: EMergedPhysicalExercises;

  @Column({
    type: 'enum',
    enum: EExerciseTimeOfDay,
    nullable: true,
  })
  time_of_day?: EExerciseTimeOfDay;

  @ManyToOne(() => UserActivities, (userActivities) => userActivities.user_physical_activities_scores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_activities_id' })
  userActivities: UserActivities;
}
