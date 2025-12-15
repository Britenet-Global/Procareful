import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Admin } from 'src/admin/entities';
import { User } from '../../user/entities/user.entity';
import { UserContact } from 'src/admin/caregiver/entities/userContact.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ length: 256, nullable: true })
  additional_info: string;

  @OneToOne(() => Admin, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => UserContact, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_contact_id' })
  user_contact: UserContact;
}
