import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Note } from './note.entity';
import { UserAdditionalInfo } from 'src/admin/caregiver/entities/userAdditionalInfo.entity';
import { UserDocuments } from '../../admin/caregiver/entities/userDocuments.entity';
import { Admin } from 'src/admin/entities';

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  name: string;

  @Column()
  unique_name: string;

  @ManyToOne(() => Note, (note) => note.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note: Note;

  @ManyToOne(() => UserAdditionalInfo, (user_additional_info) => user_additional_info.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_additional_info_id' })
  user_additional_info: UserAdditionalInfo;

  @ManyToOne(() => UserDocuments, (user_documents) => user_documents.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_documents_id' })
  user_documents: UserDocuments;

  @ManyToOne(() => Admin, (admin) => admin.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'added_by' })
  added_by: Admin;
}
