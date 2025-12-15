import { Attachment } from 'src/notes/entities/attachment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAssessment } from './userAssessment.entity';

@Entity({ name: 'user_additional_info' })
export class UserAdditionalInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Attachment, (attachment) => attachment.user_additional_info, { onDelete: 'CASCADE' })
  documents: Attachment[];

  @Column({ length: 1024, nullable: true })
  notes: string;

  @ManyToOne(() => User, (user) => user.user_additional_info, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserAssessment, (assessment) => assessment.user_additional_info, { nullable: true })
  assessment: UserAssessment;
}
