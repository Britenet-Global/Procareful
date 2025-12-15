import { Controller, Post, Body, UseGuards, Get, Request, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { IsAuthenticated } from './guard/check.authentication.guard';
import { TReqSession, TResSession } from './types';
import { TResponse } from '../../common/types';
import { EmailDto, EmailLoginDto, GeneratePinResponseDto, PhoneDto, PhoneLoginDto } from './dto';
import { Response } from 'express';
import { createResponse } from '../../common/responses/createResponse';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { BadRequestDto } from '../../common/dto';
import { LoginResponseDto, LogoutResponseDto } from './dto/';

@Controller('auth')
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/email/login')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: LoginResponseDto,
  })
  async loginViaEmail(
    @Body() body: EmailLoginDto,
    @Request() req: TReqSession,
    @Res() res: TResSession,
  ): Promise<Response<TResponse<string>>> {
    await this.authService.setCookieMaxAge(req);
    await this.authService.setCookieLang(res, req.user.id);
    const result = createResponse(200, null, 'Logged in successfully');

    return res.status(result.status).send(result);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/phone/login')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: LoginResponseDto,
  })
  async loginViaPhone(
    @Body() body: PhoneLoginDto,
    @Request() req: TReqSession,
    @Res() res: TResSession,
  ): Promise<Response<TResponse<string>>> {
    await this.authService.setCookieMaxAge(req);
    await this.authService.setCookieLang(res, req.user.id);
    const result = createResponse(200, null, 'Logged in successfully');
    return res.status(result.status).send(result);
  }
  @Post('/email/generate-pin')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: GeneratePinResponseDto,
  })
  async generatePinForEmail(
    @Request() req: TReqSession,
    @Body() body: EmailDto,
    @Res() res: Response,
  ): Promise<Response<TResponse<string>>> {
    const { email } = body;

    const result = await this.authService.generatePin({ req, email });
    return res.status(result.status).send(result);
  }
  @Post('/phone/generate-pin')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: GeneratePinResponseDto,
  })
  async generatePinForPhone(
    @Request() req: TReqSession,
    @Body() body: PhoneDto,
    @Res() res: Response,
  ): Promise<Response<TResponse<string>>> {
    const { phone } = body;
    const result = await this.authService.generatePin({ req, phone });
    return res.status(result.status).send(result);
  }
  @UseGuards(IsAuthenticated)
  @Get('/protected')
  async protected(@Res() res: Response): Promise<Response<TResponse<string>>> {
    const result = createResponse(HttpStatus.OK, null, 'Protected route');
    return res.status(result.status).send(result);
  }
  @Post('/logout')
  @ApiCreatedResponse({
    description: 'CREATED',
    type: LogoutResponseDto,
  })
  async logout(@Request() req: TReqSession, @Res() res: Response): Promise<Response<TResponse<string>>> {
    const result = await this.authService.logout(req);
    return res.status(result.status).send(result);
  }

  @Post('resend-pin')
  @ApiOkResponse({
    description: 'OK',
    type: GeneratePinResponseDto,
  })
  async resendPin(
    @Request() req: TReqSession,
    @Body() dto: EmailDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.authService.resendPin(req, dto);
    return res.status(result.status).send(result);
  }
}
