import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Admin, Status } from '.';
import { WorkingHours } from './workingHours.entity';

@Entity({ name: 'institutions' })
export class Institution {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 256, nullable: true })
  city: string;

  @Column({ length: 256, nullable: true })
  street: string;

  @Column({ length: 256, nullable: true })
  building: string;

  @Column({ length: 256, nullable: true })
  flat: string;

  @Column({ length: 32, nullable: true })
  zip_code: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true, length: 256, nullable: true })
  email: string;

  @OneToMany(() => Admin, (admin) => admin.institution)
  admins: Admin[];

  @OneToOne(() => WorkingHours, (workingHours) => workingHours.institution, { onDelete: 'CASCADE' })
  workingHours: WorkingHours;

  @ManyToOne(() => Status, (status) => status.id)
  @JoinColumn({ name: 'status_id' })
  status: Status;
}
