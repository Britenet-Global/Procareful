import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../admin/entities';
import { SessionService } from './session.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [PassportModule.register({ session: true }), TypeOrmModule.forFeature([Admin, User])],
  providers: [SessionService],
})
export class SessionModule {}
