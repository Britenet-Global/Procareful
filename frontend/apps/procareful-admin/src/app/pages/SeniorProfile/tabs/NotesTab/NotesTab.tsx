import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { SelectProps } from 'antd';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type {
  TableHeaderButtonProps,
  CheckboxProps,
  PaginationTableProps,
} from '@ProcarefulAdmin/typings';
import {
  type CaregiverControllerGetNotesFilterCategoryCategoryName,
  getCaregiverControllerGetNotesQueryKey,
  useCaregiverControllerDeleteNote,
  useCaregiverControllerGetNoteAuthors,
  useCaregiverControllerGetNotes,
  CaregiverControllerGetNotesSortBy,
  CaregiverControllerGetNotesSortOrder,
  type CaregiverControllerGetNotesParams,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import NotesModal from './NotesModal';
import NotesPreviewModal from './NotesPreviewModal';
import { categorySelectOptions, columnData } from './helpers';
import { useStyles } from './styles';

type TableFilters = CaregiverControllerGetNotesParams & {
  authorId?: number;
  category?: CaregiverControllerGetNotesFilterCategoryCategoryName;
};

const NotesTab = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();

  const [priorityFilter, setPriorityFilter] = useState<boolean>();
  const { notificationApi } = useNotificationContext();
  const [isModalVisible, toggleModalVisibility] = useToggle();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasNotePreviewParam = searchParams.has(SearchParams.Preview);
  const hasNoteEditParam = searchParams.has(SearchParams.Edit);
  const hasNoteDeleteParam = searchParams.has(SearchParams.Delete);
  const noteIdToDelete = Number(searchParams.get(SearchParams.Delete));
  const seniorId = Number(searchParams.get(SearchParams.Id));

  const {
    filters: { authorId, category, page },
    handleFilterChange,
  } = useTableFilter<TableFilters>({ authorId: undefined, category: undefined, page: 1 });

  const { data, isLoading } = useCaregiverControllerGetNotes(seniorId, {
    'filter[category][category_name]': category,
    'filter[author][id]': authorId,
    'filter[priority]': priorityFilter,
    sortBy: CaregiverControllerGetNotesSortBy.created_at,
    sortOrder: CaregiverControllerGetNotesSortOrder.DESC,
    page,
    pageSize: PaginationSize.Large,
  });

  const { data: authorData, isLoading: isAuthorDataLoading } = useCaregiverControllerGetNoteAuthors(
    seniorId,
    { query: { enabled: !!data?.details.items.length } }
  );

  const { mutate: handleDeleteNote, isPending: isDeletePending } = useCaregiverControllerDeleteNote(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetNotesQueryKey(seniorId),
          });
          notificationApi.success({
            message: t('admin_title_note_deleted_successfully'),
            description: t('admin_inf_note_deleted_successfully'),
          });
          handleDeleteNoteModalVisibility();
        },
      },
    }
  );

  const authorOptions = useMemo(
    () =>
      authorData?.details.map(({ first_name, last_name, id }) => {
        const authorName = `${first_name} ${last_name}`;

        return {
          label: authorName,
          value: id,
        };
      }),
    [authorData?.details]
  );

  const handleCheckboxChange = () => {
    setPriorityFilter(prevValue => (prevValue ? undefined : true));
  };

  const handleDeleteNoteModalVisibility = () => {
    if (hasNoteDeleteParam) {
      handleUpdateSearchParams(SearchParams.Delete);
    }
  };

  const handleCancelNoteModalVisibility = () => {
    searchParams.delete(SearchParams.Delete);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(SearchParams.Preview, noteIdToDelete.toString());
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleUpdateSearchParams = (searchParamsToDelete: SearchParams) => {
    searchParams.delete(searchParamsToDelete);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(SearchParams.Id, seniorId.toString());
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleToggleModalVisibility = () => {
    if (hasNoteEditParam) {
      handleUpdateSearchParams(SearchParams.Edit);
    }

    toggleModalVisibility();
  };

  const handleRowClick = (id: number) => {
    const queryParams = new URLSearchParams({
      [SearchParams.Id]: seniorId.toString(),
      [SearchParams.Preview]: id.toString(),
    });

    const linkTo = `${PathRoutes.SeniorProfile}?${queryParams}`;

    navigate(linkTo);
  };

  const checkboxMenu: CheckboxProps = {
    title: t('admin_table_notes_show_priority'),
    checked: priorityFilter,
    onChange: handleCheckboxChange,
  };

  const selectMenus: SelectProps[] = [
    {
      id: '1',
      options: authorOptions,
      placeholder: t('admin_table_notes_author'),
      onChange: handleFilterChange('authorId'),
      allowClear: true,
      loading: isAuthorDataLoading,
    },
    {
      id: '2',
      options: categorySelectOptions,
      placeholder: t('admin_form_note_category'),
      allowClear: true,
      onChange: handleFilterChange('category'),
    },
  ];

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_table_notes_new_note'),
    icon: <AddOutlinedIcon />,
    onClick: toggleModalVisibility,
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Large,
    onChange: handleFilterChange('page'),
    paginationPosition: 'bottom',
  };

  return (
    <div className={styles.container}>
      <TableLayout
        dataSource={data?.details?.items}
        columns={columnData}
        pagination={paginationConfig}
        isMultilineCell
        loading={isLoading}
        rowKey={item => item.id}
        rowClassName={styles.row}
        onRow={row => ({ onClick: () => handleRowClick(row.id) })}
        tableHeader={
          <TableHeader
            title={t('admin_btn_notes')}
            selectMenus={selectMenus}
            checkboxMenu={checkboxMenu}
            buttonMenu={buttonMenu}
          />
        }
      />
      <NotesModal
        isVisible={isModalVisible}
        toggleModal={handleToggleModalVisibility}
        seniorId={seniorId}
      />
      <NotesPreviewModal
        seniorId={seniorId}
        isVisible={hasNotePreviewParam}
        toggleModal={() => handleUpdateSearchParams(SearchParams.Preview)}
        toggleEditModal={toggleModalVisibility}
      />
      <PromptModal
        type="warning"
        open={hasNoteDeleteParam}
        title={t('admin_title_delete_note')}
        notificationContent={{
          header: t('admin_inf_delete_note'),
        }}
        confirmButtonText={t('admin_btn_delete')}
        confirmButtonType="primary"
        onConfirm={() => handleDeleteNote({ noteId: noteIdToDelete })}
        onCancel={handleCancelNoteModalVisibility}
        isLoading={isDeletePending}
        closable
      />
    </div>
  );
};

export default NotesTab;
