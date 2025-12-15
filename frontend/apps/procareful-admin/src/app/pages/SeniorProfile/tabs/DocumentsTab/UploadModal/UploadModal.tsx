import { type SetStateAction, type Dispatch, useState } from 'react';
import { Modal, Upload, type UploadFile, type UploadProps } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import { ACCEPTED_FILE_FORMATS, HUMAN_READABLE_FILE_FORMATS } from '@ProcarefulAdmin/constants';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type UploadModalProps = {
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
  fileList: UploadFile[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
};

const MAX_FILE_SIZE_IN_BYTES_BINARY = 5 * 1024 * 1024;
const MAX_ATTACHMENTS_COUNT = 5;

const UploadModal = ({
  fileList,
  setFileList,
  isOpen,
  onClose,
  onSubmit,
  loading,
}: UploadModalProps) => {
  const { styles } = useStyles({ showDocumentsLabel: fileList.length > 0 });
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (fileList?.length === 0) {
      setError(t('admin_alert_upload'));

      return;
    }
    setError('');
    onSubmit();
  };

  let hasTooManyFilesNotification = false;

  const draggerProps: UploadProps = {
    name: 'fileList',
    accept: ACCEPTED_FILE_FORMATS,
    multiple: true,
    beforeUpload: (file, newFileList) => {
      const isAllowedType = ACCEPTED_FILE_FORMATS.split(',').includes(file.type);
      const totalFiles = [...fileList, ...newFileList];
      const exceedsMaxCount = totalFiles.length > MAX_ATTACHMENTS_COUNT;

      if (error) {
        setError('');
      }

      if (exceedsMaxCount) {
        if (!hasTooManyFilesNotification) {
          notificationApi.error({
            message: t('admin_form_title_wrong_too_many_files_uploaded'),
            description: t('admin_form_inf_wrong_too_many_files_uploaded'),
            onClose: () => (hasTooManyFilesNotification = false),
          });

          hasTooManyFilesNotification = true;
        }

        return false;
      }

      if (file.size > MAX_FILE_SIZE_IN_BYTES_BINARY) {
        setFileList(state => [...state]);

        notificationApi.error({
          message: t('admin_form_title_wrong_file_size'),
          description: t('admin_form_inf_wrong_file_size'),
        });

        return false;
      }

      if (!isAllowedType) {
        setFileList(state => [...state]);

        notificationApi.error({
          message: t('admin_form_title_wrong_file_format'),
          description: t('admin_form_inf_wrong_file_format', {
            fileFormats: HUMAN_READABLE_FILE_FORMATS,
          }),
        });

        return false;
      }
      setFileList(state => [...state, file]);

      return false;
    },
    onRemove: file => {
      const isFileExist = fileList.some(item => item.uid === file.uid);
      if (isFileExist) {
        setFileList(fileList => fileList.filter(item => item.uid !== file.uid));

        return true;
      }

      return false;
    },
    maxCount: MAX_ATTACHMENTS_COUNT,
    defaultFileList: fileList,
    fileList,
  };

  return (
    <Modal
      open={isOpen}
      title={t('admin_title_upload_document')}
      onCancel={onClose}
      maskClosable={false}
      className={styles.modalContainer}
      keyboard={false}
      footer={
        <div className={styles.footerContainer}>
          <Text className={styles.error}>{error}</Text>

          <FormControls
            onReset={onClose}
            onSubmit={handleSubmit}
            confirmButtonText={t('admin_btn_upload')}
            resetButtonText={t('shared_btn_cancel')}
            loading={loading}
          />
        </div>
      }
    >
      <Upload.Dragger {...draggerProps} className={styles.upload}>
        <Text className={styles.uploadTopText}>{t('admin_form_note_upload_top')}</Text>
        <Text className={styles.uploadBottomText}>{t('admin_form_note_upload_bottom')}</Text>
      </Upload.Dragger>
    </Modal>
  );
};

export default UploadModal;
