import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { BadRequestFilter } from './common/filters/bad-request.filter';
import { TypeORMExceptionFilter } from './common/filters/typeorm-exception.filter';
import { TValidationErrorsKeys, ValidationAccType } from './common/types';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { randomBytes } from 'crypto';
import helmet from 'helmet';
import { contentTypeValidationMiddleware } from './common/validations/contentTypeValidation';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis').default;

const generateCorsOrigin = (isDevelopment: boolean, domain: string, seniorDomain: string): string[] => {
  const devOrigins = ['http://localhost:4200', 'http://localhost:4201'];
  const baseOrigins = [domain, seniorDomain];
  if (isDevelopment) {
    baseOrigins.push(...devOrigins);
  }
  return baseOrigins;
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const isDevelopment = configService.get('env') === 'development';

  app.use(
    helmet({
      contentSecurityPolicy: !isDevelopment
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", 'data:', 'https:'],
              connectSrc: ["'self'"],
            },
          }
        : false,
      hsts: isDevelopment
        ? false
        : {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          },
    }),
  );

  app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

  app.enableCors({
    origin: generateCorsOrigin(isDevelopment, configService.get('domain'), configService.get('seniorDomain')),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-custom-lang'],
    maxAge: 3600,
  });

  const { domain, secure, secret } = configService.get('cookie');
  const { host, port, tls } = configService.get('redis');

  app.useLogger(new Logger());

  app.setGlobalPrefix('api');

  const redisClient = createClient({ socket: { host, port, tls } });
  redisClient.connect().catch(console.error);

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: 'sess:',
      }),
      secret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        secure,
        maxAge: 60 * 60 * 1000,
        domain,
        sameSite: isDevelopment ? 'none' : 'strict',
      },
      genid: () => {
        return randomBytes(16).toString('hex');
      },
    }),
  );

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('Procareful API')
      .setDescription('Procareful API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    const fs = await import('fs');
    const dir = 'swagger';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./${dir}/swagger-spec.json`, JSON.stringify(document, null, 2));

    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []): BadRequestException => {
        return new BadRequestException(
          JSON.stringify(
            validationErrors.reduce((prev: TValidationErrorsKeys, curr: ValidationError) => {
              const iterateChildren = (
                error: ValidationError,
                acc: ValidationAccType,
                parentKey: string = '',
              ): Record<string, string[]> => {
                const key = parentKey ? `${parentKey}.${error.property}` : error.property;
                const constraintValues = Object.values(error.constraints || {});
                if (constraintValues.length > 0) {
                  acc.constraints[key] = constraintValues;
                }
                error.children?.forEach((child) => iterateChildren(child, acc, key));
                return acc.constraints;
              };

              if (!curr.children.length) {
                const constraintValues = Object.values(curr.constraints || {});
                if (constraintValues.length > 0) {
                  prev[curr.property] = constraintValues;
                }
                return prev;
              }

              const constraints = curr.children
                .map((child: ValidationError) => iterateChildren(child, { keys: [], constraints: {} }))
                .reduce((acc, val) => ({ ...acc, ...val }), {});
              if (Object.keys(constraints).length > 0) {
                prev[curr.property] = constraints;
              }

              return prev;
            }, {}),
          ),
        );
      },
    }),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter(), new BadRequestFilter(), new TypeORMExceptionFilter());

  app.use(contentTypeValidationMiddleware);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
