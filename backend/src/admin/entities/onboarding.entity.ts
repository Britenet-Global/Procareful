import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Admin } from './admin.entity';
import { User } from '../../user/entities/user.entity';
import { ESeniorFormType } from '../caregiver/types';

@Entity({ name: 'onboarding' })
export class Onboarding {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  [key: string]: boolean | number | Date | Admin | User[] | ESeniorFormType;

  @Column()
  step1: boolean;

  @Column()
  step2: boolean;

  @Column()
  step3: boolean;

  @Column({ nullable: true })
  step4: boolean;

  @Column({ nullable: true })
  step5: boolean;

  @Column({ nullable: true })
  step6: boolean;

  @Column({ type: 'enum', enum: ESeniorFormType, nullable: true })
  form_type: ESeniorFormType;

  @OneToOne(() => Admin, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @ManyToMany(() => User, (user) => user.onboarding, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable({
    joinColumn: {
      name: 'onboarding_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  user: User[];
}
