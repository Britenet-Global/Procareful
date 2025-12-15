import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { APP_FILTER } from '@nestjs/core';
import { Response } from 'express';
import { createResponse } from '../responses/createResponse';

type TParsedMessage = Record<string, unknown> | null | string | undefined;

@Catch(HttpException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const i18n = I18nContext.current(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, string>;

    let parsedMessage: TParsedMessage;

    try {
      parsedMessage = JSON.parse(exceptionResponse?.message || '');
    } catch {
      parsedMessage = exceptionResponse?.message;
    }

    const translateParsedMessage = (parsedMessage: TParsedMessage): TParsedMessage => {
      if (typeof parsedMessage !== 'object' || parsedMessage === null || !i18n) {
        return parsedMessage;
      }
      return Object.entries(parsedMessage).reduce(
        (acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.map((element: string) => {
              if (typeof element === 'string') {
                const [translationKey, params] = element.split('|');
                if (params) {
                  const parsedParams = JSON.parse(params);
                  const args: Record<string, unknown> = {};
                  Object.entries(parsedParams).forEach(([paramKey, paramValue]) => {
                    args[paramKey] = paramValue;
                  });
                  return i18n.t(translationKey, { args });
                }
                return i18n.t(translationKey);
              }
              return element;
            });
          } else if (typeof value === 'string') {
            const [translationKey, params] = value.split('|');
            if (params) {
              const parsedParams = JSON.parse(params);
              const args: Record<string, unknown> = {};
              Object.entries(parsedParams).forEach(([paramKey, paramValue]) => {
                args[paramKey] = paramValue;
              });
              acc[key] = i18n.t(translationKey, { args });
            } else {
              acc[key] = i18n.t(translationKey);
            }
          } else if (typeof value === 'object') {
            acc[key] = translateParsedMessage(value as TParsedMessage);
          }
          return acc;
        },
        {} as Record<string, string[] | unknown>,
      );
    };

    const customResponse = createResponse(
      status,
      translateParsedMessage(parsedMessage),
      i18n && i18n.t('translation.notification.negative.common.validation.title'),
      i18n && i18n.t('translation.notification.negative.common.validation.message'),
      exceptionResponse.error?.toString(),
    );

    response.status(status).json(customResponse);
  }
}

export class BadRequestFilterProvider {
  public provide = APP_FILTER;
  public useClass = BadRequestFilter;
}
