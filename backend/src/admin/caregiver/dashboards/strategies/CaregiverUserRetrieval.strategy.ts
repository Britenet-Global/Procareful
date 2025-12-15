import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../user/entities/user.entity';
import { IUserRetrievalStrategy } from '../types';
import { Admin } from '../../../entities';

@Injectable()
export class CaregiverUserRetrievalStrategy implements IUserRetrievalStrategy {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async retrieveUsers(adminId: number): Promise<User[]> {
    const caregiver = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ['users'],
    });

    if (!caregiver.users || caregiver.users.length === 0) {
      return [];
    }

    return caregiver.users;
  }
}
