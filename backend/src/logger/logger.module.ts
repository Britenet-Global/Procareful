import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Logger } from './logger.service';
import * as morgan from 'morgan';

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule implements NestModule {
  private readonly logger = new Logger('RequestLogger');

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan('combined', {
          stream: {
            write: (message: string) => {
              this.logger.debug(message.trimEnd());
            },
          },
        }),
      )
      .forRoutes('*');
  }
}
