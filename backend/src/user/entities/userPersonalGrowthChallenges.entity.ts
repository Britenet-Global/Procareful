import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPersonalGrowth } from './userPersonalGrowth.entity';

@Entity({ name: 'user_personal_growth_challenges' })
export class UserPersonalGrowthChallenges {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  description: string;

  @Column()
  icon_type: string;

  @OneToMany(() => UserPersonalGrowth, (userPersonalGrowth) => userPersonalGrowth.user_personal_growth_challenges)
  user_personal_growth: UserPersonalGrowth[];
}
