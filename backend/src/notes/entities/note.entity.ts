import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NoteCategory } from './noteCategory.entity';
import { Admin } from 'src/admin/entities';
import { User } from 'src/user/entities/user.entity';
import { Attachment } from './attachment.entity';

@Entity({ name: 'notes' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  title: string;

  @Column({ length: 1000 })
  note: string;

  @ManyToOne(() => Admin, (admin) => admin.id)
  @JoinColumn({ name: 'author_id' })
  author: Admin;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => NoteCategory, (noteCategory) => noteCategory.notes, { onDelete: 'CASCADE' })
  @JoinTable({
    joinColumn: {
      name: 'note_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  category: NoteCategory[];

  @Column({ default: false })
  priority: boolean;

  @OneToMany(() => Attachment, (attachment) => attachment.note, { onDelete: 'CASCADE' })
  attachments: Attachment[];
}
