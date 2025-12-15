import * as process from 'node:process';
import * as crypto from 'node:crypto';

type TValue = number | string | boolean | Buffer;

type TValueObject = Record<string, TValue>;

export default (): Record<string, TValue | TValueObject> => ({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  domain: process.env.PRC_DOMAIN,
  seniorDomain: process.env.PRC_SENIOR_DOMAIN,
  mlDomain: process.env.PRC_ML_DOMAIN,
  landingPage: process.env.PRC_LANDING_PAGE_URL,
  database: {
    username: process.env.PRC_DB_USERNAME,
    password: process.env.PRC_DB_PASSWORD,
    host: process.env.PRC_DB_HOST,
    port: process.env.PRC_DB_PORT,
    database: process.env.PRC_DB_DATABASE,
  },
  email: {
    service: process.env.PRC_EMAIL_SERVICE,
    host: process.env.PRC_EMAIL_HOST,
    port: process.env.PRC_EMAIL_PORT,
    secure: JSON.parse(process.env.PRC_EMAIL_SECURE),
    user: process.env.PRC_EMAIL_USER,
    pass: process.env.PRC_EMAIL_PASSWORD,
    from: process.env.PRC_EMAIL_FROM,
  },
  redis: {
    host: process.env.PRC_REDIS_HOST,
    port: process.env.PRC_REDIS_PORT,
    tls: process.env.PRC_REDIS_TLS,
  },
  cookie: {
    domain: new URL(process.env.PRC_DOMAIN).hostname,
    seniorDomain: new URL(process.env.PRC_SENIOR_DOMAIN).hostname,
    secure: JSON.parse(process.env.PRC_SECURE_COOKIE),
    secret: process.env.PRC_SESSION_SECRET,
  },
  ttl: {
    resetLink: process.env.PRC_RESET_LINK_ID_TTL,
  },
  minio: {
    endPoint: process.env.PRC_MINIO_ENDPOINT,
    accessKey: process.env.PRC_MINIO_ACCESSKEY,
    secretKey: process.env.PRC_MINIO_SECRETKEY,
    region: process.env.PRC_MINIO_REGION,
    bucketName: process.env.PRC_MINIO_BUCKET_NAME,
    bucketNameNotes: process.env.PRC_MINIO_BUCKET_NAME_NOTES,
    bucketNameDocuments: process.env.PRC_MINIO_BUCKET_NAME_DOCUMENTS,
    bucketNameVideos: process.env.PRC_MINIO_BUCKET_NAME_VIDEOS,
  },
  apiKey: crypto.createHash('sha256').update(process.env.PRC_API_KEY).digest(),
  reportApiKey: crypto.createHash('sha256').update(process.env.PRC_REPORT_API_KEY).digest(),
  appVersion: process.env.PRC_APP_VERSION,
  synchronizeSchema: process.env.PRC_SYNCHRONIZE_SCHEMA,
});
