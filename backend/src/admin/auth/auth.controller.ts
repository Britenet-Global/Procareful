import { Controller, Post, Request, UseGuards, Body, Query, Get, HttpStatus, Res, Req, Put } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerificationCodeDto,
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  ValidateVerificationCodeResponseDto,
  ValidateForgotPasswordDto,
  ValidateResetPasswordDto,
  SignupResponseDto,
  SignupDto,
  GetMeResponseDto,
  ChangePasswordResponseDto,
  ResendVerificationCode,
} from './dto';
import { TCodeVerificationReq, TLoginReq, TLogoutReq } from './types';
import { IsAuthenticated } from './guard/check.authentication.guard';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { BadRequestDto } from 'src/common/dto/api-response.dto';
import { TResponse } from 'src/common/types';
import { createResponse } from 'src/common/responses/createResponse';
import { Response } from 'express';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { ERole } from '../types';
import { ChangePasswordDto, VerifySignupCredentialsDto } from '../dto';
import { Admin } from '../entities';

@Controller('auth')
@UseGuards(RolesGuard)
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({
    description: 'CREATED',
    type: LoginResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: TLoginReq,
    @Res() res: Response,
  ): Promise<Response<TResponse<string>>> {
    const result = await this.authService.handleLogin(loginDto, req);

    return res.status(result.status).send(result);
  }

  @Post('resend-verification-code')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: ResendVerificationCode,
  })
  async resendVerificationCode(
    @Request() req: TCodeVerificationReq,
    @Res() res: Response,
  ): Promise<Response<TResponse<string>>> {
    const result = await this.authService.handleResendVerificationCode(req);

    return res.status(result.status).send(result);
  }

  @Post('validate-verification-code')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: ValidateVerificationCodeResponseDto,
  })
  async validateVerificationCode(
    @Body() body: VerificationCodeDto,
    @Request() req: TCodeVerificationReq,
    @Res() res: Response,
  ): Promise<Response<TResponse<string>>> {
    const validationCode = body.code;
    const rememberMe = body.rememberMe;

    const result = await this.authService.validateVerificationCode(req, validationCode, rememberMe);

    return res.status(result.status).send(result);
  }

  @Post('logout')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: LogoutResponseDto,
  })
  async logout(@Request() req: TLogoutReq, @Res() res: Response): Promise<Response<TResponse<string>>> {
    const result = await this.authService.logout(req);

    return res.status(result.status).send(result);
  }

  //? for testing
  @Get('protected')
  @UseGuards(IsAuthenticated)
  @Roles(ERole.HEAD_ADMIN)
  async protected(@Res() res: Response): Promise<Response<TResponse<string>>> {
    const result = createResponse(HttpStatus.OK, null, 'Protected route');

    return res.status(result.status).send(result);
  }

  @Post('forgot')
  @ApiCreatedResponse({
    description: 'OK',
    type: ValidateForgotPasswordDto,
  })
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Res() res: Response,
    @Req() req: TLoginReq,
  ): Promise<Response<TResponse<null>>> {
    const result = await this.authService.sendForgotPasswordEmail<null>(body.email, req);

    return res.status(result.status).send(result);
  }

  @Post('reset')
  @ApiCreatedResponse({
    description: 'OK',
    type: ValidateResetPasswordDto,
  })
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Query('linkId') linkId: string,
    @Request() req: TLogoutReq,
    @Res() res: Response,
  ): Promise<Response<TResponse<null>>> {
    const result = await this.authService.resetAdminPassword(body.newPassword, linkId, req);

    return res.status(result.status).send(result);
  }

  @Post('signup')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: SignupResponseDto,
  })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response): Promise<Response<TResponse<string>>> {
    const result = await this.authService.signup(signupDto);
    return res.status(result.status).send(result);
  }

  @Get('me')
  @UseGuards(IsAuthenticated)
  @ApiOkResponse({
    description: 'OK',
    type: GetMeResponseDto,
  })
  async getMe(@Req() req: { user: { userData: Admin } }, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.authService.getMe(req.user);
    return res.status(result.status).send(result);
  }

  @Post('verify-signup-credentials')
  async verifySignupCredentials(
    @Body() verifySignupCredentialsDto: VerifySignupCredentialsDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.authService.verifySignupCredentials(verifySignupCredentialsDto);
    return res.status(result.status).send(result);
  }

  @Put('change-password')
  @UseGuards(IsAuthenticated)
  @ApiOkResponse({
    description: 'OK',
    type: ChangePasswordResponseDto,
  })
  async changePassword(
    @Req() req: { user: { userData: Admin } },
    @Res() res: Response,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<Response<TResponse>> {
    const adminId = req.user.userData.id;
    const result = await this.authService.changePassword(adminId, changePasswordDto);
    return res.status(result.status).send(result);
  }
}
