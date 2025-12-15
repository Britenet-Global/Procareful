import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ESocialAbilitiesResponseType } from '../types';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_social_abilities' })
export class UserSocialAbilities {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: ESocialAbilitiesResponseType,
  })
  experience_of_emptiness: ESocialAbilitiesResponseType;

  @Column({
    type: 'enum',
    enum: ESocialAbilitiesResponseType,
  })
  miss_having_people_around: ESocialAbilitiesResponseType;

  @Column({
    type: 'enum',
    enum: ESocialAbilitiesResponseType,
  })
  feel_rejected: ESocialAbilitiesResponseType;

  @Column({
    type: 'enum',
    enum: ESocialAbilitiesResponseType,
  })
  rely_on_people: ESocialAbilitiesResponseType;

  @Column({
    type: 'enum',
    enum: ESocialAbilitiesResponseType,
  })
  trust_completely: ESocialAbilitiesResponseType;

  @Column({
    type: 'enum',
    enum: ESocialAbilitiesResponseType,
  })
  enough_people_feel_close: ESocialAbilitiesResponseType;

  @ManyToOne(() => User, (user) => user.user_social_abilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserAssessment, (assessment) => assessment.user_social_abilities)
  assessment: UserAssessment;
}
