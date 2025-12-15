import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type UploadFile } from 'antd';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type {
  TableHeaderButtonProps,
  SearchProps,
  PaginationTableProps,
} from '@ProcarefulAdmin/typings';
import { downloadFile } from '@ProcarefulAdmin/utils/downloadFile';
import {
  type CaregiverControllerGetDocumentsParams,
  getCaregiverControllerGetDocumentsQueryKey,
  useCaregiverControllerGetDocuments,
  useCaregiverControllerUploadSeniorDocuments,
  useCaregiverControllerDeleteSeniorDocument,
  getCaregiverControllerGetSeniorDocumentQueryKey,
  caregiverControllerGetSeniorDocument,
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import UploadModal from './UploadModal';
import { getColumnData } from './helpers';
import { useStyles } from './styles';

const DocumentsTab = () => {
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const [isUploadModalVisible, toggleUploadModal] = useToggle();
  const [isRemoveModalVisible, toggleRemoveModal] = useToggle();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { styles } = useStyles({ showDocumentsLabel: fileList.length > 0 });
  const seniorId = searchParams.get(SearchParams.Id);
  const seniorIdNumber = Number(seniorId);

  const {
    filters: { search, page },
    handleFilterChange,
  } = useTableFilter<CaregiverControllerGetDocumentsParams>({ page: 1, search: undefined });

  const {
    data: documentsData,
    isLoading: documentsLoading,
    isFetching: documentsFetching,
  } = useCaregiverControllerGetDocuments(
    seniorIdNumber,
    {
      search,
      page,
      pageSize: PaginationSize.Large,
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const { mutate: addDocuments, isPending: isAddDocumentsPending } =
    useCaregiverControllerUploadSeniorDocuments({
      mutation: {
        onSuccess: () => {
          setFileList([]);
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetDocumentsQueryKey(seniorIdNumber, {
              page,
              pageSize: PaginationSize.Large,
            }),
          });
          notificationApi.success({
            message: t('admin_alert_document_added_successfully_title'),
            description: t('admin_alert_document_added_successfully_subtitle'),
          });

          toggleUploadModal();
        },
      },
    });

  const { mutate: deleteDocument } = useCaregiverControllerDeleteSeniorDocument({
    mutation: {
      onSuccess: () => {
        toggleRemoveModal();
        queryClient.invalidateQueries({
          queryKey: getCaregiverControllerGetDocumentsQueryKey(seniorIdNumber, {
            page,
            pageSize: PaginationSize.Large,
          }),
        });

        notificationApi.success({
          message: t('admin_alert_document_removed_successfully_title'),
          description: t('admin_alert_document_removed_successfully_subtitle'),
        });
      },
    },
  });

  const handleDownloadDocument = async (documentId: number, documentName: string) => {
    const downloadedFile: Blob = await queryClient.fetchQuery({
      queryKey: getCaregiverControllerGetSeniorDocumentQueryKey(seniorIdNumber, documentId),
      queryFn: () =>
        caregiverControllerGetSeniorDocument(seniorIdNumber, documentId, {
          responseType: 'blob',
        }),
    });

    if (!downloadedFile) {
      return;
    }

    const blob = new Blob([downloadedFile], { type: 'application/octet-stream' });
    downloadFile(blob, documentName);

    notificationApi.success({
      message: t('admin_alert_document_downloaded_successfully_title'),
      description: t('admin_alert_document_downloaded_successfully_subtitle'),
    });
  };

  const handleFormSubmit = () => {
    addDocuments({
      userId: seniorIdNumber,
      data: {
        files: fileList as unknown as Blob[],
      },
    });
  };

  const handleRemoveDocument = (documentId: number) => {
    toggleRemoveModal();
    setSelectedDocumentId(documentId);
  };

  const handleCancelOfRemoveModal = () => {
    setSelectedDocumentId(null);
    toggleRemoveModal();
  };

  const handleRemoveDocumentConfirm = () => {
    if (!selectedDocumentId) {
      return;
    }

    deleteDocument({ userId: seniorIdNumber, documentId: selectedDocumentId });
  };

  const searchMenu: SearchProps = {
    onSearch: handleFilterChange('search'),
    placeholder: t('admin_form_search'),
    className: styles.search,
    allowClear: true,
  };

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_table_upload_file'),
    icon: <UploadOutlinedIcon />,
    onClick: toggleUploadModal,
  };

  const paginationConfig: PaginationTableProps = {
    defaultCurrent: page,
    total: documentsData?.details.pagination.total,
    pageSize: PaginationSize.Large,
    onChange: handleFilterChange('page'),
    paginationPosition: 'bottom',
  };

  return (
    <>
      <TableLayout
        dataSource={documentsData?.details.items}
        columns={getColumnData({
          onDownload: handleDownloadDocument,
          onRemove: handleRemoveDocument,
          userId: userData?.details.admin.id,
        })}
        pagination={paginationConfig}
        containerBordered={false}
        rowKey={item => item.id}
        loading={documentsLoading || documentsFetching}
        tableHeader={
          <TableHeader
            title={t('admin_btn_documents')}
            searchMenu={searchMenu}
            buttonMenu={buttonMenu}
          />
        }
      />
      <UploadModal
        fileList={fileList}
        setFileList={setFileList}
        isOpen={isUploadModalVisible}
        onClose={toggleUploadModal}
        onSubmit={handleFormSubmit}
        loading={isAddDocumentsPending}
      />
      <PromptModal
        type="warning"
        open={isRemoveModalVisible}
        onCancel={handleCancelOfRemoveModal}
        onConfirm={handleRemoveDocumentConfirm}
        confirmButtonType="primary"
        title={t('admin_alert_remove_document_title')}
        confirmButtonText={t('admin_alert_remove_document_title')}
      >
        {t('admin_alert_remove_document_subtitle')}
      </PromptModal>
    </>
  );
};

export default DocumentsTab;
