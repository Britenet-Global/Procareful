import { EContactType } from 'src/admin/types';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserRelationships } from './userRelationships.entity';

@Entity({ name: 'user_contacts' })
export class UserContact {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  email_address: string;

  @Column({
    type: 'enum',
    enum: EContactType,
  })
  contact_type: EContactType;

  @ManyToMany(() => UserRelationships, (relation) => relation.relations)
  @JoinTable({
    joinColumn: { name: 'user_contact_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'relation_id', referencedColumnName: 'id' },
  })
  relation: UserRelationships[];

  @ManyToOne(() => User, (user) => user.user_contact, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
