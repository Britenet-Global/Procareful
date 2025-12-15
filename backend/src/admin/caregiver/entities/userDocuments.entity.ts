import { Attachment } from 'src/notes/entities/attachment.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_documents' })
export class UserDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Attachment, (attachment) => attachment.user_documents, { onDelete: 'CASCADE' })
  documents: Attachment[];

  @OneToOne(() => User, (user) => user.user_documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
