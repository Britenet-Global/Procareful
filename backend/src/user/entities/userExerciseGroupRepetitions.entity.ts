import { EActivityLevel, EMergedExercisePosition, EMergedPhysicalExercises } from 'src/admin/caregiver/types';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_exercise_group_repetitions' })
export class UserExerciseGroupRepetitions {
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
    enum: EMergedExercisePosition,
  })
  position: EMergedExercisePosition;

  @Column({
    type: 'enum',
    enum: EActivityLevel,
  })
  group: EActivityLevel;

  @Column()
  repetitions: number;

  @Column()
  time: number;

  @Column({ nullable: true })
  times_per_day: number;

  @Column({ nullable: true })
  times_per_week: number;
}
