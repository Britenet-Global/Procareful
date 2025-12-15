import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { SelectProps } from 'antd';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize, PathRoutes, selectStatusOptions } from '@ProcarefulAdmin/constants';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type {
  TableHeaderButtonProps,
  SearchProps,
  CheckboxProps,
  PaginationTableProps,
} from '@ProcarefulAdmin/typings';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  type CaregiverControllerGetUsersParams,
  useCaregiverControllerGetUsers,
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  AdminRolesDtoRoleName,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { columnData } from './helpers';
import { useStyles } from './styles';

type TableFilters = CaregiverControllerGetUsersParams & {
  status?: CaregiverControllerGetUsersParams['filter[status][status_name]'];
};

export const Seniors = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const [showSeniorsWithMissingAssessmentOnly, setShowSeniorsWithMissingAssessmentOnly] =
    useState<boolean>();
  useOnboardingStepComplete();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isFormalCaregiver = verifyAccessByRole(
    AdminRolesDtoRoleName.formalCaregiver,
    userData?.details.admin.roles
  );

  const {
    filters: { search, status, page },
    handleFilterChange,
  } = useTableFilter<TableFilters>({
    search: undefined,
    status: undefined,
    page: 1,
  });

  const { data, isLoading } = useCaregiverControllerGetUsers(
    {
      search,
      assessmentCompleted: showSeniorsWithMissingAssessmentOnly ? false : undefined,
      'filter[status][status_name]': status,
      page: showSeniorsWithMissingAssessmentOnly ? 1 : page,
      pageSize: PaginationSize.Large,
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const selectMenus: SelectProps[] = [
    {
      id: '1',
      options: selectStatusOptions,
      placeholder: t('admin_table_status'),
      onChange: handleFilterChange('status'),
      allowClear: true,
    },
  ];

  const checkboxMenu: CheckboxProps = {
    title: t('admin_table_show_seniors_requiring_action'),
    checked: showSeniorsWithMissingAssessmentOnly,
    onChange: () => setShowSeniorsWithMissingAssessmentOnly(prevValue => !prevValue),
  };

  const searchMenu: SearchProps = {
    onSearch: handleFilterChange('search'),
    placeholder: t('admin_form_search'),
    className: styles.search,
    allowClear: true,
  };

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_btn_add_senior'),
    icon: <PersonAddAlt1OutlinedIcon />,
    buttonType: 'link',
    navigateTo: PathRoutes.SeniorAddEntry,
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Large,
    onChange: handleFilterChange('page'),
  };

  return (
    <TableLayout
      dataSource={data?.details?.items}
      columns={columnData}
      pagination={paginationConfig}
      loading={isLoading}
      rowKey={item => item.id}
      isMultilineCell
      tableHeader={
        <TableHeader
          title={t('admin_title_seniors')}
          searchMenu={searchMenu}
          checkboxMenu={checkboxMenu}
          selectMenus={selectMenus}
          {...(isFormalCaregiver ? { buttonMenu } : {})}
        />
      }
    />
  );
};

export default Seniors;
