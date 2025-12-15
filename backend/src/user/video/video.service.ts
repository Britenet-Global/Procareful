import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { MinioClientService } from '../../minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { createResponse } from '../../common/responses/createResponse';
import { TResponse } from '../../common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'node:path';
import * as fs from 'fs';
import { UserBreathingExercises } from '../../admin/caregiver/entities/userBreathingExercises.entity';
import { UserPhysicalExercises } from '../../admin/caregiver/entities/userPhysicalExercises.entity';
import {
  EBreathingExercisePosition,
  EBreathingExerciseType,
  EPhysicalExercisePosition,
  EPhysicalExercises,
} from '../../admin/caregiver/types';
import { UploadAllVideosDto, UploadVideoDto } from './dto';
import { Readable } from 'node:stream';
import { fileTypeFromBuffer } from 'file-type';
import { Logger } from '../../logger/logger.service';

interface MinioError extends Error {
  code?: string;
}

@Injectable()
export class VideoService {
  constructor(
    private readonly minioClientService: MinioClientService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly loggerService: Logger,

    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(UserPhysicalExercises)
    private readonly userPhysicalExercisesRepository: Repository<UserPhysicalExercises>,

    @InjectRepository(UserBreathingExercises)
    private readonly userBreathingExercisesRepository: Repository<UserBreathingExercises>,
  ) {}

  async streamVideo(id: number, res: Response, range?: string): Promise<TResponse> {
    const { bucketNameVideos } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();

    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      return createResponse(HttpStatus.NOT_FOUND, null, 'Video not found');
    }

    try {
      const stat = await s3Client.headObject({ Bucket: bucketNameVideos, Key: video.uniqueName });
      const videoSize = stat.ContentLength;
      const videoRange = range;

      if (videoRange) {
        const parts = videoRange.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
        const chunkSize = end - start + 1;

        const head = {
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
        };

        res.writeHead(HttpStatus.PARTIAL_CONTENT, head);

        const params = {
          Bucket: bucketNameVideos,
          Key: video.uniqueName,
          Range: `bytes=${start}-${end}`,
        };

        const result = await s3Client.getObject(params);
        const stream = result.Body as Readable;

        stream.pipe(res);
      } else {
        const head = {
          'Content-Length': videoSize,
          'Accept-Ranges': 'bytes',
          'Content-Type': 'video/mp4',
        };
        res.writeHead(HttpStatus.OK, head);

        const params = {
          Bucket: bucketNameVideos,
          Key: video.uniqueName,
        };

        const result = await s3Client.getObject(params);
        const stream = result.Body as Readable;

        stream.pipe(res);
      }
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching video');
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    { exerciseName, position }: UploadVideoDto,
  ): Promise<TResponse<string[] | string>> {
    const { bucketNameVideos, region } = this.configService.get('minio');
    const s3Client = this.minioClientService.getClient();
    let result: string = null;

    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 255);
    const fileName = sanitizedName;
    const fileExtension = path.extname(fileName);
    const uniqueName = `${uuidv4()}${fileExtension}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const isValuePhysicalExercise = Object.values(EPhysicalExercises).some((ex) => ex === exerciseName);

    const addNewVideo = async (fileName: string, uniqueName: string): Promise<Video> => {
      const video = new Video();
      video.fileName = fileName;
      video.uniqueName = uniqueName;
      await queryRunner.manager.save(video);
      result = fileName;
      return video;
    };

    const removeOldVideo = async (existingVideo: Video): Promise<TResponse | void> => {
      if (existingVideo) {
        try {
          await s3Client.deleteObject({ Bucket: bucketNameVideos, Key: existingVideo.uniqueName }),
            await queryRunner.manager.remove(Video, existingVideo);
        } catch (error) {
          this.loggerService.log(error);
          await queryRunner.rollbackTransaction();
          return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Error', 'Error removing old video');
        }
      }
    };

    const assignVideoToExercise = async (
      name: EPhysicalExercises | EBreathingExerciseType,
      position: EBreathingExercisePosition | EPhysicalExercisePosition,
      video: Video,
    ): Promise<TResponse> => {
      if (isValuePhysicalExercise) {
        const physicalExercise = await this.userPhysicalExercisesRepository.findOne({
          where: { name: name as EPhysicalExercises, position: position as EPhysicalExercisePosition },
          relations: ['video'],
        });

        if (!physicalExercise) {
          return createResponse(HttpStatus.BAD_REQUEST, null, 'Error', 'Physical exercise not found');
        }

        const oldVideo = physicalExercise.video;
        physicalExercise.video = null;
        await queryRunner.manager.save(physicalExercise);

        const removeResult = await removeOldVideo(oldVideo);
        if (removeResult) {
          return removeResult;
        }
        physicalExercise.video = video;
        await queryRunner.manager.update(UserPhysicalExercises, { id: physicalExercise.id }, { video });
      }

      if (!isValuePhysicalExercise) {
        const breathingExercise = await this.userBreathingExercisesRepository.findOne({
          where: { name: name as EBreathingExerciseType, position: position as EBreathingExercisePosition },
          relations: ['video'],
        });

        if (!breathingExercise) {
          return createResponse(HttpStatus.BAD_REQUEST, null, 'Error', 'Breathing exercise not found');
        }

        const oldVideo = breathingExercise.video;
        breathingExercise.video = null;
        await queryRunner.manager.save(breathingExercise);

        const removeResult = await removeOldVideo(oldVideo);
        if (removeResult) {
          return removeResult;
        }

        breathingExercise.video = video;
        await queryRunner.manager.update(UserBreathingExercises, { id: breathingExercise.id }, { video });
      }
    };

    try {
      await this.validateVideFile(file);
      const buckets = await s3Client.listBuckets();
      const bucketExists = buckets.Buckets.some((bucket) => bucket.Name === bucketNameVideos);

      if (!bucketExists) {
        await s3Client.createBucket({
          Bucket: bucketNameVideos,
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        });
      }

      const videos = await this.videoRepository.find({ where: { fileName } });
      if (!videos.length) {
        const video = await addNewVideo(fileName, uniqueName);
        const assignResult = await assignVideoToExercise(exerciseName, position, video);
        if (assignResult) return assignResult;
      } else {
        for (const video of videos) {
          try {
            await s3Client.headObject({ Bucket: bucketNameVideos, Key: video.uniqueName });
            return createResponse(HttpStatus.CONFLICT, fileName, 'File already exists');
          } catch (err) {
            const video = await addNewVideo(fileName, uniqueName);
            const assignResult = await assignVideoToExercise(exerciseName, position, video);
            if (assignResult) return assignResult;
          }
        }
      }
      await queryRunner.commitTransaction();
      await s3Client.putObject({
        Bucket: bucketNameVideos,
        Key: uniqueName,
        Body: file.buffer,
      });
      return createResponse(HttpStatus.CREATED, result, 'Success', 'File uploaded successfully');
    } catch (error) {
      this.loggerService.log(error);
      await queryRunner.rollbackTransaction();
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Error uploading video');
    } finally {
      await queryRunner.release();
    }
  }

  async listVideos(): Promise<TResponse<Video[]>> {
    try {
      const videos = await this.videoRepository.find();
      return createResponse(HttpStatus.OK, videos, 'Videos retrieved successfully');
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Error listing videos');
    }
  }

  async deleteVideo(id: number): Promise<TResponse> {
    const { bucketNameVideos, region } = this.configService.get('minio');
    const queryRunner = this.dataSource.createQueryRunner();
    const s3Client = this.minioClientService.getClient();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const video = await this.videoRepository.findOne({ where: { id } });
      if (!video) {
        await queryRunner.rollbackTransaction();
        return createResponse(HttpStatus.NOT_FOUND, null, 'File not found');
      }
      const buckets = await s3Client.listBuckets();
      const bucketExists = buckets.Buckets.some((bucket) => bucket.Name === bucketNameVideos);
      if (!bucketExists) {
        await s3Client.createBucket({
          Bucket: bucketNameVideos,
          CreateBucketConfiguration: {
            LocationConstraint: region,
          },
        });
      }
      await s3Client.deleteObject({
        Bucket: bucketNameVideos,
        Key: video.uniqueName,
      });
      await queryRunner.manager.delete(Video, { id });

      await queryRunner.commitTransaction();
      return createResponse(HttpStatus.OK, null, 'File deleted successfully');
    } catch (error) {
      const minioError = error as MinioError;
      this.loggerService.log(error);
      await queryRunner.rollbackTransaction();
      if (minioError.code === 'NotFound') {
        return createResponse(HttpStatus.NOT_FOUND, null, 'File not found');
      }
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Error deleting video');
    } finally {
      await queryRunner.release();
    }
  }

  async uploadAllVideos({
    sourceFolder,
  }: UploadAllVideosDto): Promise<TResponse | TResponse<TResponse<string | string[]>[]>> {
    try {
      const files = await fs.promises.readdir(sourceFolder);
      const uploadResults = [];

      for (const file of files) {
        const fileExtension = path.extname(file);
        const [, position, exerciseNameWithExtension] = file.split('-');
        const [exerciseName] = exerciseNameWithExtension.split('.');

        const uploadVideoDto = {
          exerciseName,
          position,
        };

        const filePath = path.join(sourceFolder, file);
        const fileBuffer = await fs.promises.readFile(filePath);

        const result = await this.uploadVideo(
          {
            originalname: file,
            buffer: fileBuffer,
            mimetype: `video/${fileExtension}`,
            size: fileBuffer.length,
            fieldname: '',
            encoding: '',
            stream: null,
            destination: '',
            filename: file,
            path: filePath,
          },
          uploadVideoDto as UploadVideoDto,
        );

        uploadResults.push(result);
      }

      return createResponse(HttpStatus.CREATED, uploadResults, 'Videos uploaded successfully');
    } catch (error) {
      this.loggerService.log(error);
      return createResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, 'Failed to upload files');
    }
  }

  async validateVideFile(file: Express.Multer.File): Promise<void> {
    const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
    const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.ogg'];
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File too large. Max 100MB');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const type = await fileTypeFromBuffer(new Uint8Array(file.buffer));
    if (!type || !ALLOWED_MIME_TYPES.includes(type.mime)) {
      throw new BadRequestException('File content does not match extension');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException('Invalid file extension');
    }
  }
}
