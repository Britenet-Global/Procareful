import { IsIn } from 'class-validator';
import { EStatus } from '../types';
import { Exclude } from 'class-transformer';

export class SetStatusDto {
  @IsIn([EStatus.ACTIVE, EStatus.INACTIVE])
  status: Exclude<EStatus, EStatus.CREATED>;
}
