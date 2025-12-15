import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserCognitiveAbilities } from './userCognitiveAbilities.entity';
import { UserPhysicalActivities } from './userPhysicalActivities.entity';
import { UserSocialAbilities } from './userSocialAbilities.entity';
import { UserQualityOfLife } from './userQualityOfLife.entity';
import { UserSleepAssessment } from './userSleepAssessment.entity';
import { UserAdditionalInfo } from './userAdditionalInfo.entity';
import { User } from '../../../user/entities/user.entity';
import { UserConditionAssessmentScores } from './userConditionAssesmentScores.entity';
import { EEditCarePlanReason } from '../types';

@Entity({ name: 'user_assessment' })
export class UserAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToOne(() => UserCognitiveAbilities, (user_cognitive_abilities) => user_cognitive_abilities.assessment)
  @JoinColumn({ name: 'user_cognitive_abilities_id' })
  user_cognitive_abilities: UserCognitiveAbilities;

  @OneToOne(() => UserPhysicalActivities, (user_physical_activities) => user_physical_activities.assessment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_physical_activities_id' })
  user_physical_activities: UserPhysicalActivities;

  @OneToOne(() => UserSocialAbilities, (user_social_abilities) => user_social_abilities.assessment)
  @JoinColumn({ name: 'user_social_abilities_id' })
  user_social_abilities: UserSocialAbilities;

  @OneToOne(() => UserQualityOfLife, (user_quality_of_life) => user_quality_of_life.assessment)
  @JoinColumn({ name: 'user_quality_of_life_id' })
  user_quality_of_life: UserQualityOfLife;

  @OneToOne(() => UserSleepAssessment, (user_sleep_assessment) => user_sleep_assessment.assessment)
  @JoinColumn({ name: 'user_sleep_assessment_id' })
  user_sleep_assessment: UserSleepAssessment;

  @OneToOne(() => UserAdditionalInfo, (user_additional_info) => user_additional_info.assessment, { nullable: true })
  @JoinColumn({ name: 'user_additional_info_id' })
  user_additional_info: UserAdditionalInfo;

  @ManyToOne(() => User, (user) => user.assessments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  users: User;

  @OneToOne(
    () => UserConditionAssessmentScores,
    (user_condition_assessment_scores) => user_condition_assessment_scores.user_assessment,
    { onDelete: 'CASCADE' },
  )
  user_condition_assessment_scores: UserConditionAssessmentScores;

  @Column({ type: 'enum', enum: EEditCarePlanReason, nullable: true })
  edit_care_plan_reason: EEditCarePlanReason;
}
