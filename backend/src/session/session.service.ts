import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/admin/entities';
import { IUserWithModule } from 'src/common/types';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService extends PassportSerializer {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  private getUser(): {
    Admin: (userId: number) => Promise<Admin>;
    User: (userId: number) => Promise<User>;
  } {
    return {
      Admin: async (userId: number) =>
        await this.adminRepository
          .createQueryBuilder('admin')
          .where('admin.id =:userId', { userId })
          .leftJoinAndSelect('admin.roles', 'role')
          .select([
            'admin.id',
            'admin.first_name',
            'admin.last_name',
            'admin.phone_number',
            'admin.email_address',
            'admin.date_of_birth',
            'admin.first_login',
            'role.role_name',
          ])
          .getOne(),
      User: async (userId: number) =>
        await this.userRepository
          .createQueryBuilder('user')
          .where('user.id =:userId', { userId })
          .select(['user.first_name', 'user.last_name', 'user.date_of_birth', 'user.email_address'])
          .getOne(),
    };
  }

  serializeUser(user: IUserWithModule<Admin | User>, done: (err: Error, user: { userId: number }) => void): void {
    const serializedUser = {
      userId: user.userData.id,
      module: user.module,
    };
    done(null, serializedUser);
  }

  async deserializeUser(
    payload: { userId: number; module: 'Admin' | 'User' },
    done: (err: Error, payload: { userId: number }) => void,
  ): Promise<void> {
    const user = await this.getUser()[payload.module](payload.userId);
    const newPayload = {
      ...payload,
      userData: user,
    };
    done(null, newPayload);
  }
}
