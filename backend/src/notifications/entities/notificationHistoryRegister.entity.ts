import { Admin } from 'src/admin/entities';
import { User } from 'src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ENotificationPriority, ENotificationTitle } from '../types';

@Entity({ name: 'notification_history_register' })
export class NotificationHistoryRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ nullable: true })
  date_of_email_sending: Date;

  @Column({ default: false })
  notification_in_app: boolean;

  @Column({ default: false })
  notification_by_email: boolean;

  @Column({ default: false })
  displayed: boolean;

  @ManyToOne(() => Admin, (admin) => admin.id)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ENotificationTitle,
  })
  title: ENotificationTitle;

  @Column({
    type: 'enum',
    enum: ENotificationPriority,
  })
  priority: ENotificationPriority;
}
