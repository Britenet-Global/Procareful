import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Institution, Country, Role, Status } from '.';
import { CaregiverRole } from './caregiverRole.entity';
import { User } from 'src/user/entities/user.entity';
import { WorkingHours } from './workingHours.entity';
import { Note } from 'src/notes/entities/note.entity';
import { NotificationHistoryRegister } from 'src/notifications/entities/notificationHistoryRegister.entity';
import { Attachment } from 'src/notes/entities/attachment.entity';

@Entity({ name: 'admins' })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ length: 256, nullable: true })
  first_name: string;

  @Column({ length: 256, nullable: true })
  last_name: string;

  @ManyToOne(() => Institution, (institution) => institution.admins, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  @Column({ length: 256, unique: true })
  phone_number: string;

  @Column({ length: 256, unique: true })
  email_address: string;

  @Column({ length: 256, nullable: true, select: false })
  password: string;

  @ManyToOne(() => Country, (country) => country.id, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToMany(() => Role, (role) => role.admins)
  @JoinTable({
    joinColumn: {
      name: 'admin_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => CaregiverRole, (caregiverRole) => caregiverRole.admins)
  @JoinTable({
    joinColumn: {
      name: 'admin_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'caregiver_role_id',
      referencedColumnName: 'id',
    },
  })
  caregiver_roles: CaregiverRole[];

  @ManyToOne(() => Status, (status) => status.id)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @Column({ type: 'timestamptz', nullable: true })
  date_of_birth: Date;

  @ManyToMany(() => User, (user) => user.admins, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable({
    joinColumn: {
      name: 'admin_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => User, (user) => user.created_by)
  created_users: User[];

  @OneToOne(() => WorkingHours, (workingHours) => workingHours.admin, { onDelete: 'CASCADE' })
  workingHours: WorkingHours;

  @Column({ nullable: true })
  image_name: string;

  @OneToMany(() => Note, (note) => note.author)
  notes: Note[];

  @OneToMany(() => NotificationHistoryRegister, (notification) => notification.admin)
  notification: NotificationHistoryRegister[];

  @Column({ default: false })
  first_login: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.added_by, { onDelete: 'CASCADE' })
  attachments: Attachment[];
}
