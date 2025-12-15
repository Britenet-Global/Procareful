import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { Button, Modal, Upload, type UploadProps, type UploadFile } from 'antd';
import { type UploadFileStatus } from 'antd/es/upload/interface';
import { downloadFile } from '@ProcarefulAdmin/utils/downloadFile';
import {
  caregiverControllerDownloadNoteAttachment,
  getCaregiverControllerDownloadNoteAttachmentQueryKey,
  useCaregiverControllerGetNoteById,
} from '@Procareful/common/api';
import { SearchParams, TimeFormat } from '@Procareful/common/lib';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Text, Tag } from '@Procareful/ui';
import { renderCategoryLabels } from '../helpers';
import { useStyles } from './styles';

type NotesModalProps = {
  isVisible: boolean;
  seniorId: number;
  toggleModal: () => void;
  toggleEditModal: () => void;
};

const NotesPreviewModal = ({
  isVisible,
  seniorId,
  toggleModal,
  toggleEditModal,
}: NotesModalProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notificationApi } = useNotificationContext();

  const noteId = Number(searchParams.get(SearchParams.Preview));

  const { data } = useCaregiverControllerGetNoteById(seniorId, noteId);

  const { title, category, note, author, attachments, priority, created_at, updated_at, editable } =
    data?.details || {};

  const authorFullName = `${author?.first_name} ${author?.last_name}`;
  const isEdited = !dayjs(created_at).isSame(updated_at);
  const editedText = `(${t('admin_form_note_edited')})`;

  const attachmentsAntDesignFormat = attachments?.map(({ name, id }) => ({
    status: 'done' as UploadFileStatus,
    name,
    uid: id,
  }));

  const handleDownloadDocument = async ({ uid, name }: UploadFile) => {
    const downloadedFile: Blob = await queryClient.fetchQuery({
      queryKey: getCaregiverControllerDownloadNoteAttachmentQueryKey(Number(uid)),
      queryFn: () =>
        caregiverControllerDownloadNoteAttachment(Number(uid), {
          responseType: 'blob',
        }),
    });

    if (!downloadedFile) {
      return;
    }

    const blob = new Blob([downloadedFile], { type: 'application/octet-stream' });
    downloadFile(blob, name);

    notificationApi.success({
      message: t('admin_alert_document_downloaded_successfully_title'),
      description: t('admin_alert_document_downloaded_successfully_subtitle'),
    });
  };

  const uploadProps: UploadProps = {
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: t('shared_btn_download'),
      showRemoveIcon: false,
    },
    name: 'fileList',
    multiple: true,
    disabled: false,
    defaultFileList: attachmentsAntDesignFormat as unknown as UploadFile[],
    fileList: attachmentsAntDesignFormat as unknown as UploadFile[],
    onDownload: handleDownloadDocument,
  };

  const updateSearchParams = (searchParamsToUpdate: SearchParams) => {
    searchParams.delete(SearchParams.Preview);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(searchParamsToUpdate, noteId.toString());
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleEditNote = () => {
    updateSearchParams(SearchParams.Edit);
    toggleEditModal();
  };

  return (
    <Modal
      title={title}
      centered
      maskClosable={false}
      open={isVisible}
      className={styles.modal}
      footer={null}
      onCancel={toggleModal}
      keyboard={false}
    >
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <Text strong className={styles.authorInfoTitle}>
            {t('admin_form_note_added_by')}
          </Text>
          <div className={cx(styles.authorInfoContainer)}>
            <div>
              <Text>{authorFullName}</Text>
              {isEdited && <Text className={styles.editedText}>{editedText}</Text>}
            </div>
            <Text>{dayjs(created_at).format(TimeFormat.DATE_FORMAT)}</Text>
          </div>
        </div>
        {(category?.length || priority) && (
          <div className={styles.labelsContainer}>
            {category && !!category.length && renderCategoryLabels(category)}
            {priority && <Tag customColor="red">{t('admin_table_priority')}</Tag>}
          </div>
        )}
        <Text strong>{t('admin_form_note_description')}</Text>
        <div className={styles.noteContainer}>{note}</div>
        {!!attachments?.length && (
          <>
            <Text strong>{t('admin_form_note_attachments')}</Text>
            <Upload className={styles.upload} {...uploadProps} />
          </>
        )}
      </div>

      {editable && (
        <div className={styles.buttonsContainer}>
          <Button danger onClick={() => updateSearchParams(SearchParams.Delete)}>
            {t('admin_btn_delete')}
          </Button>
          <Button className={styles.editButton} onClick={handleEditNote}>
            {t('shared_btn_edit')}
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default NotesPreviewModal;
