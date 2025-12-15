import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  uniqueName: string;

  @CreateDateColumn()
  createdAt: Date;
}
