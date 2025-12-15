import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Response } from 'express';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  healthcheck(@Res() res: Response, @I18n() i18n: I18nContext): Response {
    const healthMessage = { message: i18n.t('translation.healthy') };

    return res.status(HttpStatus.OK).json(healthMessage);
  }
}
