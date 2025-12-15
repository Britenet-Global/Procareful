import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_cognitive_abilities' })
export class UserCognitiveAbilities {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  moca_scoring: number;

  @ManyToOne(() => User, (user) => user.user_cognitive_abilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserAssessment, (assessment) => assessment.user_cognitive_abilities)
  assessment: UserAssessment;
}
