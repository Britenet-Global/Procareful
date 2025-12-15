import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT') private readonly client: RedisClientType;

  async saveLinkIdToRedis(linkId: string, userId: number, expiresIn: number): Promise<void> {
    const key = 'linkId:' + linkId;

    const foundOldLinks = await this.client.ft.search('idx:linkIds', `@userId:[${userId} ${userId}]`);
    await Promise.all(foundOldLinks.documents.map(async (e) => this.client.json.del(e.id)));

    await this.client
      .multi()
      .json.set(key, '$', {
        linkId,
        userId,
      })
      .expire(key, expiresIn)
      .exec();
  }

  async getUserIdByLinkIdFromRedis(linkId: string): Promise<string | null> {
    const res = (await this.client.json.get(`linkId:${linkId}`)) as { userId: string } | null;
    if (!res) {
      return null;
    }
    return res.userId;
  }

  async removeLinkFromRedis(linkId: string): Promise<void> {
    await this.client.json.del(`linkId:${linkId}`);
  }

  async saveItemToRedis(item: string | number, id: string, collectionName: string, expiresIn?: number): Promise<void> {
    await this.client.set(`${collectionName}:${item}`, id, {
      EX: expiresIn,
    });
  }

  async getItemFromRedis(item: string | number, collectionName: string): Promise<string | null> {
    const res = (await this.client.get(`${collectionName}:${item}`)) as null;
    if (!res) {
      return null;
    }
    return res;
  }

  async removeItemFromRedis(item: string, collectionName: string): Promise<void> {
    await this.client.del(`${collectionName}:${item}`);
  }

  async saveSessionInfo(institutionId: number, sessionId: string): Promise<void> {
    await this.client.sAdd(`ins:sess:${institutionId}`, `sess:${sessionId}`);
  }

  async removeSessionsFromRedisByInstitution(institutionId: number): Promise<void> {
    const pattern = `ins:sess:${institutionId}`;
    const keys = await this.client.sMembers(pattern);
    await this.client.del([...keys, pattern]);
  }
}
