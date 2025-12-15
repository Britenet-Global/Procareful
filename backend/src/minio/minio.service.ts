import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';

@Injectable()
export class MinioClientService {
  private readonly s3Client: S3;

  constructor(private readonly configService: ConfigService) {
    const { endPoint, accessKey, secretKey, region } = this.configService.get('minio');

    this.s3Client = new S3({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      endpoint: endPoint,
      forcePathStyle: true,
    });
  }

  getClient(): S3 {
    return this.s3Client;
  }
}
