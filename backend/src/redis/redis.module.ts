import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchemaFieldTypes, createClient } from 'redis';
import { Logger } from '../logger/logger.service';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  providers: [
    ConfigService,
    Logger,
    {
      inject: [ConfigService, Logger],
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService, logger: Logger): Promise<ReturnType<typeof createClient>> => {
        const { host, port, tls } = configService.get('redis');
        const client = createClient({
          socket: {
            host,
            port,
            tls,
          },
        });
        await client.connect();
        try {
          await client.ft.dropIndex('idx:linkIds');
        } catch (e) {
          logger.log(e);
        }
        try {
          await client.ft.create(
            'idx:linkIds',
            {
              '$.linkId': {
                type: SchemaFieldTypes.TEXT,
                SORTABLE: true,
              },
              '$.userId': {
                type: SchemaFieldTypes.NUMERIC,
                AS: 'userId',
                SORTABLE: true,
              },
            },
            {
              ON: 'JSON',
              PREFIX: 'linkId:',
            },
          );
        } catch (e) {
          logger.log(e);
        }
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
