import { type GetProp } from 'antd';
import { type UploadProps } from 'antd/es/upload';

export type UploadFileData = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: UploadFileData): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
