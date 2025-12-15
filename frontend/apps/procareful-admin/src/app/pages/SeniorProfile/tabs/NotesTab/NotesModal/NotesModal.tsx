import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useSearchParams } from 'react-router-dom';
import type { z } from 'zod';
import {
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  Upload,
  type UploadProps,
  type UploadFile,
} from 'antd';
import { ACCEPTED_FILE_FORMATS, HUMAN_READABLE_FILE_FORMATS } from '@ProcarefulAdmin/constants';
import { addNoteFormSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  type GetNoteResponseDto,
  type AddNoteDtoCategoryItem,
  type UpdateNoteDtoCategoryItem,
  type ErrorResponse,
  getCaregiverControllerGetNoteByIdQueryKey,
  getCaregiverControllerGetNotesQueryKey,
  useCaregiverControllerAddNote,
  useCaregiverControllerUploadNote,
  useCaregiverControllerUpdateNote,
} from '@Procareful/common/api';
import {
  type Key,
  useNotificationContext,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { Text } from '@Procareful/ui';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { categorySelectOptions } from '../helpers';
import { useStyles } from './styles';

type NotesModalProps = {
  isVisible: boolean;
  toggleModal: () => void;
  seniorId: number;
};

type NotesModalData = z.infer<typeof addNoteFormSchema>;

const MAXIMAL_FILE_SIZE_IN_BYTES_BINARY = 5 * 1024 * 1024;
const MAX_ATTACHMENTS_COUNT = 5;

const NotesModal = ({ isVisible, toggleModal, seniorId }: NotesModalProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const { notificationApi } = useNotificationContext();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [searchParams] = useSearchParams();
  const noteId = Number(searchParams.get(SearchParams.Edit));
  const hasEditNoteParam = searchParams.has(SearchParams.Edit);
  const saveButtonContent = hasEditNoteParam ? t('shared_btn_save_changes') : t('shared_btn_save');

  const noteData: GetNoteResponseDto | undefined = queryClient.getQueryData(
    getCaregiverControllerGetNoteByIdQueryKey(seniorId, noteId)
  );

  const { title, category, note, attachments, priority } = noteData?.details || {};

  const categoryData = category?.map(c => c.category_name) as unknown as AddNoteDtoCategoryItem[];

  let hasTooManyFilesNotification = false;

  const { control, handleSubmit, reset, setError } = useForm<NotesModalData>({
    resolver: zodResolver(addNoteFormSchema),
    values: {
      note: note || '',
      title: title || '',
      priority: priority || false,
      category: categoryData || undefined,
    },
  });

  const onError = (error: ErrorResponse) => {
    setBackendFieldErrors(error, setError);
  };

  const handleAddNoteSuccessful = () => {
    reset();
    queryClient.invalidateQueries({
      queryKey: getCaregiverControllerGetNotesQueryKey(seniorId),
    });
    notificationApi.success({
      message: t('admin_title_note_added_successfully'),
      description: t('admin_inf_note_added_successfully'),
    });
    toggleModal();
  };

  const { mutate: handleUploadNoteFiles, isPending: isUploadPending } =
    useCaregiverControllerUploadNote({
      mutation: {
        onSuccess: () => {
          setFileList([]);

          return handleAddNoteSuccessful();
        },
        onError,
      },
    });

  const { mutate: handleAddNote, isPending: isAddPending } = useCaregiverControllerAddNote({
    mutation: {
      onSuccess: ({ details: noteId }) => {
        const fileListToSend = fileList as unknown as Blob[];

        if (!fileListToSend.length) {
          handleAddNoteSuccessful();

          return;
        }

        handleUploadNoteFiles({
          noteId,
          data: {
            files: fileListToSend,
          },
        });
      },
      onError,
    },
  });

  const { mutate: handleUpdateNote, isPending: isUpdatePending } = useCaregiverControllerUpdateNote(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetNoteByIdQueryKey(seniorId, noteId),
          });
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetNotesQueryKey(seniorId),
          });
          notificationApi.success({
            message: t('admin_title_note_updated_successfully'),
            description: t('admin_inf_note_updated_successfully'),
          });
          toggleModal();
          reset();
        },
        onError,
      },
    }
  );

  const draggerProps: UploadProps = {
    name: 'fileList',
    accept: ACCEPTED_FILE_FORMATS,
    multiple: true,
    beforeUpload: (file, attachmentFileList) => {
      const isAllowedType = ACCEPTED_FILE_FORMATS.split(',').includes(file.type);
      const updatedFileList = [...fileList, ...attachmentFileList];

      if (updatedFileList.length > MAX_ATTACHMENTS_COUNT) {
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

      if (file.size > MAXIMAL_FILE_SIZE_IN_BYTES_BINARY) {
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
    disabled: !!noteId,
    defaultFileList: fileList,
    fileList,
  };

  const disabledUploadProps: UploadProps = {
    name: 'fileList',
    multiple: true,
    disabled: true,
    defaultFileList: attachments as unknown as UploadFile[],
    fileList: attachments as unknown as UploadFile[],
  };

  const categoryOptionLabel = () => (
    <>
      <Text>{t('admin_form_note_category')}</Text>
      <HelpOutlineIcon className={styles.labelIcon} />
      <Text className={styles.labelBracketsText}>({t('admin_inf_optional')})</Text>
    </>
  );

  const onSubmit: SubmitHandler<NotesModalData> = data => {
    if (hasEditNoteParam) {
      const updatedCategory = data.category as unknown as UpdateNoteDtoCategoryItem[];

      return handleUpdateNote({ noteId, data: { ...data, category: updatedCategory } });
    }
    handleAddNote({ seniorId, data });
  };

  const handleUploadRender = () => {
    if (hasEditNoteParam) {
      return (
        !!attachments?.length && (
          <div>
            <Text strong>{t('admin_form_note_attachments')}</Text>
            <Upload className={styles.upload} {...disabledUploadProps} />
          </div>
        )
      );
    }

    return (
      <>
        <Text className={styles.text}>{t('admin_form_note_attachments')}</Text>
        <Upload.Dragger {...draggerProps} className={styles.upload}>
          <Text className={styles.uploadTopText}>{t('admin_form_note_upload_top')}</Text>
          <Text className={styles.uploadBottomText}>{t('admin_form_note_upload_bottom')}</Text>
        </Upload.Dragger>
      </>
    );
  };

  return (
    <Modal
      title={title || t('admin_title_note_modal')}
      centered
      maskClosable={false}
      open={isVisible}
      className={styles.modal}
      footer={null}
      onCancel={toggleModal}
      keyboard={false}
    >
      <div className={styles.formContainer}>
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={styles.form}>
          <div>
            <FormItem control={control} name="title" label={t('admin_form_note_title')} hasFeedback>
              <Input />
            </FormItem>
            <FormItem control={control} name="category" label={categoryOptionLabel()} hasFeedback>
              <Select
                mode="multiple"
                className={styles.select}
                options={categorySelectOptions.map(o => ({ ...o, label: t(o.label as Key) }))}
                placeholder={t('admin_form_select_placeholder')}
              />
            </FormItem>
            <FormItem
              control={control}
              name="note"
              label={t('admin_form_note_description')}
              hasFeedback
            >
              <Input.TextArea
                rows={hasEditNoteParam ? 6 : 4}
                className={cx(styles.textArea, { [styles.textAreaUpdate]: hasEditNoteParam })}
                placeholder={t('admin_form_note_text')}
              />
            </FormItem>
            <FormItem control={control} name="priority" valuePropName="checked">
              <Checkbox>{t('admin_btn_priority')}</Checkbox>
            </FormItem>
            {handleUploadRender()}
          </div>
          <Form.Item className={styles.buttonContainer}>
            <Button onClick={toggleModal}>{t('shared_btn_cancel')}</Button>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              loading={isAddPending || isUploadPending || isUpdatePending}
            >
              {saveButtonContent}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default NotesModal;
