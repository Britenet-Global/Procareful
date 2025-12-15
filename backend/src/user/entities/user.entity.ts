import { Admin, Institution, Onboarding, Status } from 'src/admin/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Score } from '../games/entities';
import { Note } from 'src/notes/entities/note.entity';
import { UserContact } from 'src/admin/caregiver/entities/userContact.entity';
import { UserSleepAssessment } from '../../admin/caregiver/entities/userSleepAssessment.entity';
import { UserSocialAbilities } from '../../admin/caregiver/entities/userSocialAbilities.entity';
import { UserPhysicalActivities } from 'src/admin/caregiver/entities/userPhysicalActivities.entity';
import { UserQualityOfLife } from '../../admin/caregiver/entities/userQualityOfLife.entity';
import { UserAdditionalInfo } from 'src/admin/caregiver/entities/userAdditionalInfo.entity';
import { UserCognitiveAbilities } from '../../admin/caregiver/entities/userCognitiveAbilities.entity';
import { NotificationHistoryRegister } from 'src/notifications/entities/notificationHistoryRegister.entity';
import { UserAssessment } from '../../admin/caregiver/entities/userAssessment.entity';
import { UserActivities } from 'src/admin/caregiver/entities/userActivities.entity';
import { UserDocuments } from '../../admin/caregiver/entities/userDocuments.entity';
import { UserBrainPoints } from './user.brain-points.entity';
import { UserAssignedCarePlanHistory } from './userAssignedCarePlanHistory.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ length: 256, nullable: true })
  first_name: string;

  @Column({ length: 256, nullable: true })
  last_name: string;

  @Column({ type: 'timestamptz', nullable: true })
  date_of_birth: Date;

  @Column({ length: 256, unique: true })
  phone_number: string;

  @Column({ length: 256, unique: true, nullable: true })
  email_address: string;

  @ManyToOne(() => Admin, (admin) => admin.created_users)
  @JoinColumn({ name: 'created_by_id' })
  created_by: Admin;

  @ManyToOne(() => Institution, (institution) => institution.id, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  @ManyToOne(() => Status, (status) => status.id)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @ManyToMany(() => Admin, (admin) => admin.users, { nullable: true, onDelete: 'CASCADE' })
  admins: Admin[];

  @Column({ nullable: true })
  image_name: string;

  @OneToMany(() => Score, (score) => score.user, { onDelete: 'CASCADE' })
  scores: Score[];

  @OneToMany(() => Note, (note) => note.user, { onDelete: 'CASCADE' })
  notes: Note[];

  @OneToMany(() => UserContact, (user_contact) => user_contact.user, { onDelete: 'CASCADE' })
  user_contact: UserContact[];

  @OneToMany(() => UserSleepAssessment, (user_sleep_assessment) => user_sleep_assessment.user, { onDelete: 'CASCADE' })
  user_sleep_assessment: UserSleepAssessment[];

  @OneToMany(() => UserSocialAbilities, (user_social_abilities) => user_social_abilities.user, { onDelete: 'CASCADE' })
  user_social_abilities: UserSocialAbilities[];

  @OneToMany(() => UserPhysicalActivities, (user_physical_activities) => user_physical_activities.user, {
    onDelete: 'CASCADE',
  })
  user_physical_activities: UserPhysicalActivities[];

  @OneToMany(() => UserQualityOfLife, (user_quality_of_life) => user_quality_of_life.user, { onDelete: 'CASCADE' })
  user_quality_of_life: UserQualityOfLife[];

  @OneToMany(() => UserAdditionalInfo, (user_additional_info) => user_additional_info.user, { onDelete: 'CASCADE' })
  user_additional_info: UserAdditionalInfo[];

  @OneToMany(() => UserCognitiveAbilities, (user_cognitive_abilities) => user_cognitive_abilities.user, {
    onDelete: 'CASCADE',
  })
  user_cognitive_abilities: UserCognitiveAbilities[];

  @ManyToMany(() => Onboarding, (onboarding) => onboarding.user, { onDelete: 'CASCADE' })
  onboarding: Onboarding[];

  @OneToMany(() => NotificationHistoryRegister, (notification) => notification.user, { onDelete: 'CASCADE' })
  notification: NotificationHistoryRegister[];

  @OneToMany(() => UserAssessment, (assessment) => assessment.users, { onDelete: 'CASCADE' })
  assessments: UserAssessment[];

  @OneToOne(() => UserActivities, (userActivities) => userActivities.user)
  userActivities: UserActivities;

  @OneToOne(() => UserDocuments, (user_documents) => user_documents.user)
  user_documents: UserDocuments;

  @OneToOne(() => UserBrainPoints, (user_brain_points) => user_brain_points.user, { onDelete: 'CASCADE' })
  user_brain_points: UserBrainPoints;

  @Column({ type: 'int', nullable: true })
  failed_login_attempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockout_until: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity: Date;

  @Column({ nullable: true })
  last_performance_warning: Date;

  @OneToMany(() => UserAssignedCarePlanHistory, (planHistory) => planHistory.user, { onDelete: 'CASCADE' })
  planHistory: UserAssignedCarePlanHistory[];
}
