import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from '../../../common/dto';
import { TResponseDetails } from '../../../common/types';
import { Video } from '../entities/video.entity';
import { UploadAllVideosResDto } from './upload-all-videos-res.dto';

export class DeleteVideoResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Video deleted');

  @ApiProperty()
  details: TResponseDetails = null;
}

export class GetVideoListResponseDto {
  @ApiProperty()
  status: number = 200;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Video list fetched');

  @ApiProperty()
  details: Video[];
}

export class UploadVideoResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Video uploaded');

  @ApiProperty()
  details: string;
}

export class UploadAllVideosResponseDto {
  @ApiProperty()
  status: number = 201;

  @ApiProperty({ type: NotificationDto })
  notification: NotificationDto = new NotificationDto('Videos uploaded successfully');

  @ApiProperty()
  details: UploadAllVideosResDto[];
}
