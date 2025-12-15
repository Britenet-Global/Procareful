import { useState, useEffect, forwardRef, type ForwardRefRenderFunction } from 'react';
import { Upload as AntUpload, Image } from 'antd';
import { type RcFile } from 'antd/es/upload';
import { type UploadProps as AntUploadProps, type UploadFile } from 'antd/lib/upload';
import { MAXIMAL_FILE_SIZE_IN_BYTES_BINARY_1MB } from '@ProcarefulAdmin/constants';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import UploadButton from './UploadButton';
import { getBase64 } from './helpers';
import { useStyles } from './styles';

export type PlaceholderSize = 'small' | 'big';

type UploadProps = {
  onFileChange?: (newFile: UploadFile | null) => void;
  defaultFile?: UploadFile | null;
  placeholderSize?: PlaceholderSize;
  uploadClassName?: string;
  previewImageStyle?: string;
  isPreview?: boolean;
} & Omit<AntUploadProps, 'onRemove' | 'beforeUpload' | 'onChange' | 'action'>;

const Upload: ForwardRefRenderFunction<HTMLInputElement, UploadProps> = (
  {
    listType = 'picture-card',
    defaultFile,
    onFileChange,
    placeholderSize = 'small',
    uploadClassName,
    previewImageStyle,
    isPreview = false,
    ...uploadProps
  }: UploadProps,
  ref
) => {
  const { styles, cx } = useStyles({ placeholderSize });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificationApi } = useNotificationContext();
  const { t } = useTypedTranslation();

  const handleChange: AntUploadProps['onChange'] = ({ file, fileList }) => {
    if (!onFileChange) return;

    if (file && file.size && file.size > MAXIMAL_FILE_SIZE_IN_BYTES_BINARY_1MB) {
      notificationApi.error({
        message: t('admin_form_title_wrong_file_size'),
        description: t('admin_form_inf_wrong_file_size_over_1MB'),
      });

      return;
    }

    const newFile = fileList.at(-1);

    if (newFile) {
      onFileChange(newFile);
      setFileList([newFile]);
    }

    if (file.status === 'removed') {
      setFileList([]);
      onFileChange(null);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
    }

    setPreviewImage(file.preview || file.url || '');
    setPreviewOpen(true);
  };

  useEffect(() => {
    setFileList(defaultFile ? [defaultFile] : []);
    setLoading(false);
  }, [defaultFile]);

  return (
    <div className={styles.container}>
      <AntUpload
        ref={ref}
        {...uploadProps}
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false}
        className={cx(styles.upload, uploadClassName)}
        listType="picture-card"
        accept="image/png, image/jpg, image/jpeg"
      >
        {!isPreview && fileList.length === 0 && <UploadButton loading={loading} />}
      </AntUpload>
      {previewImage && (
        <Image
          wrapperClassName={styles.imageWrapper}
          preview={{
            visible: previewOpen,
            onVisibleChange: setPreviewOpen,
            afterOpenChange: visible => !visible && setPreviewImage(''),
            classNames: {
              content: previewImageStyle,
            },
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

Upload.displayName = 'Upload';

const AvatarUpload = forwardRef(Upload);

export default AvatarUpload;
