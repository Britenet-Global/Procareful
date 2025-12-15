import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsPhoneNumberValid } from '../../common/decorators';
import { TValidationKey } from '../../common/utils/translationKeys';
import { Transform } from 'class-transformer';

export class VerifySignupCredentialsDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email_address: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumberValid({ message: `${TValidationKey}.PHONE_NUMBER` })
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
