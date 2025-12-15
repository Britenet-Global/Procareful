import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRetrievalStrategy } from '../types';
import { User } from '../../../../user/entities/user.entity';
import { Admin } from '../../../entities';

@Injectable()
export class InstitutionUserRetrievalStrategy implements IUserRetrievalStrategy {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async retrieveUsers(adminId: number): Promise<User[]> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ['institution'],
    });

    const users = await this.userRepository.find({
      where: {
        institution: {
          id: admin.institution.id,
        },
      },
    });

    if (!users || users.length === 0) {
      return [];
    }

    return users;
  }
}
