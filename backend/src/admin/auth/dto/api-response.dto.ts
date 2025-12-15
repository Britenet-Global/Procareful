import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from 'src/common/dto/api-response.dto';
import { TResponseDetails } from 'src/common/types';
import { GetMeDto } from './get-me.dto';

export class LoginResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Validation code sent to email.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ValidateVerificationCodeResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Verification success, you are logged in');

  @ApiProperty()
  details: GetMeDto;
}

export class ResendVerificationCode {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Validation code sent to email.');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class LogoutResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Logged out successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ValidateForgotPasswordDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Email send successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ValidateResetPasswordDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('New password changed successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class SignupResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('You are signed up!');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetMeResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Logged in Admin details');

  @ApiProperty()
  details: GetMeDto;
}

export class ChangePasswordResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Password updated successfully');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class ChangePasswordConfirmResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Password changed, please log in again with new password');

  @ApiProperty()
  details: TResponseDetails = null;
}
