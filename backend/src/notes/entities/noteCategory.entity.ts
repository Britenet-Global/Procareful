import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ENoteCategory } from '../types';
import { Note } from './note.entity';

@Entity({ name: 'note_categories' })
export class NoteCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ENoteCategory,
  })
  category_name: ENoteCategory;

  @ManyToMany(() => Note, (note) => note.category, { onDelete: 'CASCADE' })
  notes: Note[];
}
