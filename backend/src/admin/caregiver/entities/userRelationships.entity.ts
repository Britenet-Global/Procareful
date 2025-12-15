import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ERelationshipToSenior } from '../../types';
import { UserContact } from './userContact.entity';

@Entity({ name: 'user_relationships' })
export class UserRelationships {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ERelationshipToSenior })
  relations: ERelationshipToSenior;

  @ManyToMany(() => UserContact, (contact) => contact.relation)
  contact: UserContact[];
}
