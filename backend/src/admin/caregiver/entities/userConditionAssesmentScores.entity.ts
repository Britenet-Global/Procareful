import { Check, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EActivityLevel, EUserCognitiveAbilitiesGroup, EUserPhysicalActivityGroup } from '../types';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_condition_assessment_scores' })
export class UserConditionAssessmentScores {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: EUserCognitiveAbilitiesGroup,
  })
  cognitive_abilities_group: EUserCognitiveAbilitiesGroup;

  @Column({
    type: 'enum',
    enum: EUserPhysicalActivityGroup,
  })
  physical_activities_group: EUserPhysicalActivityGroup;

  @Column({
    type: 'enum',
    enum: EActivityLevel,
    nullable: true,
  })
  physical_activities_tier: EActivityLevel;

  @Column({ nullable: true })
  @Check('CHK_138cecb1b79423f0e45db325b6_social_abilities', `"social_abilities" BETWEEN 0 AND 6`)
  social_abilities: number;

  @Column({ nullable: true })
  @Check('CHK_138cecb1b79423f0e45db325b6_social_loneliness', `"social_abilities" BETWEEN 0 AND 6`)
  social_loneliness: number;

  @Column({ nullable: true })
  @Check('CHK_138cecb1b79423f0e45db325b6_emotional_loneliness', `"social_abilities" BETWEEN 0 AND 6`)
  emotional_loneliness: number;

  @Column({ length: 5 })
  quality_of_life: string;

  @Column()
  @Check(`"sleep_assessment" BETWEEN 0 AND 21`)
  sleep_assessment: number;

  @OneToOne(() => UserAssessment, (user_assessment) => user_assessment.user_condition_assessment_scores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_assessment_id' })
  user_assessment: UserAssessment;
}
