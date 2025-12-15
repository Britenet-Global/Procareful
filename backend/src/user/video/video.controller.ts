import {
  Controller,
  Get,
  Param,
  Res,
  // UseGuards,
  Headers,
  ParseIntPipe,
  Post,
  UseInterceptors,
  Delete,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BadRequestDto } from '../../common/dto';
import { IsAuthenticated } from '../auth/guard/check.authentication.guard';
import { VideoService } from './video.service';
import { Response } from 'express';
import { TResponse } from '../../common/types';
import { VideosFilesValidationPipe } from '../../common/validations/videosValidationPipe';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DeleteVideoResponseDto,
  GetVideoListResponseDto,
  UploadAllVideosResponseDto,
  UploadVideoResponseDto,
} from './dto/api-response.dto';
import { UploadAllVideosDto, UploadVideoDto } from './dto';
import { EMergedExercisePosition, EMergedPhysicalExericsesWithoutWalking } from '../../admin/caregiver/types';

@Controller('video')
@ApiBadRequestResponse({ description: 'BAD REQUEST', type: BadRequestDto })
@UseGuards(IsAuthenticated)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('stream/:id')
  @ApiHeader({
    name: 'range',
    description: 'Range header for partial content',
    required: false,
  })
  @ApiOkResponse({
    description: 'OK',
  })
  async getStreamVideo(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Headers('range') range?: string | null,
  ): Promise<Response<TResponse>> {
    const result: TResponse | void = await this.videoService.streamVideo(id, res, range);
    if (result) {
      return res.status(result.status).send(result);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({
    description: 'CREATED',
    type: UploadVideoResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      required: ['exerciseName', 'position', 'file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        exerciseName: {
          type: 'enum',
          enum: Object.values(EMergedPhysicalExericsesWithoutWalking),
        },
        position: {
          type: 'enum',
          enum: Object.values(EMergedExercisePosition),
        },
      },
    },
  })
  async uploadVideo(
    @UploadedFile(new VideosFilesValidationPipe()) file: Express.Multer.File,
    @Body() uploadVideoDto: UploadVideoDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.videoService.uploadVideo(file, uploadVideoDto);
    return res.status(result.status).send(result);
  }

  @Get('list')
  @ApiOkResponse({
    description: 'OK',
    type: GetVideoListResponseDto,
  })
  async listVideos(@Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.videoService.listVideos();
    return res.status(result.status).send(result);
  }

  @Delete('delete/:id')
  @ApiOkResponse({
    description: 'OK',
    type: DeleteVideoResponseDto,
  })
  async deleteVideo(@Param('id', ParseIntPipe) id: number, @Res() res: Response): Promise<Response<TResponse>> {
    const result = await this.videoService.deleteVideo(id);
    return res.status(result.status).send(result);
  }

  @Post('upload-all-videos')
  @ApiOkResponse({
    description: 'CREATED',
    type: UploadAllVideosResponseDto,
  })
  async uploadAllVideos(
    @Body() uploadAllVideosDto: UploadAllVideosDto,
    @Res() res: Response,
  ): Promise<Response<TResponse>> {
    const result = await this.videoService.uploadAllVideos(uploadAllVideosDto);
    return res.status(result.status).send(result);
  }
}
