import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headerApiKey = request.headers['x-api-key'];

    if (!headerApiKey) {
      throw new UnauthorizedException('API key is missing.');
    }

    const apiKeyHash = this.configService.get('apiKey');

    try {
      const headerApiKeyHash = crypto.createHash('sha256').update(headerApiKey).digest();
      if (
        apiKeyHash.length !== headerApiKeyHash.length ||
        !crypto.timingSafeEqual(new Uint8Array(apiKeyHash), new Uint8Array(headerApiKeyHash))
      ) {
        throw new UnauthorizedException('Invalid API key.');
      }
    } catch {
      throw new UnauthorizedException('Invalid API key.');
    }

    return true;
  }
}
