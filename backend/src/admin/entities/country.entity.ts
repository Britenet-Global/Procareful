import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Admin } from './admin.entity';
import { ELanguage } from '../types';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  country_name: string;

  @Column({ type: 'enum', enum: ELanguage, nullable: true })
  country_code: ELanguage;

  @OneToMany(() => Admin, (admin) => admin.country, { nullable: true })
  admins: Admin[];
}
