export class UploadAllVideosResDto {
  status: number = 201;
  notification: {
    title: string;
    message: string;
  };
  details: string;
}
