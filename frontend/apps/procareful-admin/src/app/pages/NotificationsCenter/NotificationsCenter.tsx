import { DownOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { type Key, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Button,
  Dropdown,
  Space,
  type MenuProps,
  type CheckboxProps,
  type DropdownProps,
  type TableProps,
} from 'antd';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type { PaginationTableProps, RedirectionProps, SearchProps } from '@ProcarefulAdmin/typings';
import {
  useCaregiverControllerGetMyNotifications,
  CaregiverControllerGetMyNotificationsFilterPriority,
  useCaregiverControllerMarkNotificationsAsRead,
  getCaregiverControllerGetMyNotificationsQueryKey,
  getCaregiverControllerGetUnreadNotificationCountQueryKey,
  type CaregiverControllerGetMyNotificationsParams,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import { columnData } from './helpers';
import { useStyles } from './styles';

const NotificationsCenter = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isNotificationsCenterPathName = location.pathname === PathRoutes.NotificationsCenter;
  const [rowIds, setRowIds] = useState<Key[]>([]);
  const [priorityFilter, setPriorityFilter] =
    useState<CaregiverControllerGetMyNotificationsFilterPriority>();
  const {
    filters: { search, page },
    handleFilterChange,
  } = useTableFilter<CaregiverControllerGetMyNotificationsParams>({ search: undefined, page: 1 });

  const isAnyNotificationMarked = rowIds.length;
  const pageSize = isNotificationsCenterPathName ? PaginationSize.Large : PaginationSize.Small;

  const { data, isLoading } = useCaregiverControllerGetMyNotifications({
    'filter[priority]': priorityFilter,
    search,
    page,
    pageSize,
  });

  const { mutate: markNotificationAsRead } = useCaregiverControllerMarkNotificationsAsRead({
    mutation: {
      onSuccess: async () => {
        setRowIds([]);
        await queryClient.invalidateQueries({
          queryKey: getCaregiverControllerGetUnreadNotificationCountQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getCaregiverControllerGetMyNotificationsQueryKey(),
        });
      },
    },
  });

  const handleCheckboxChange = () => {
    setPriorityFilter(prevValue =>
      prevValue ? undefined : CaregiverControllerGetMyNotificationsFilterPriority.high
    );
  };

  const checkboxMenu: CheckboxProps = {
    title: t('admin_table_notes_show_priority'),
    checked: !!priorityFilter,
    onChange: handleCheckboxChange,
  };

  const searchMenu: SearchProps = {
    onSearch: handleFilterChange('search'),
    placeholder: t('admin_form_search_senior'),
    className: styles.search,
    allowClear: true,
  };

  const redirectionMenu: RedirectionProps = {
    linkTo: PathRoutes.NotificationsCenter,
    title: t('admin_table_show_all'),
  };

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowIds: Key[]) => setRowIds(selectedRowIds),
    selectedRowKeys: rowIds,
  };

  const items: MenuProps['items'] = [
    //  TODO: additional functionality could be implement in future - first of all the endpoint should be implemented before we start
    // {
    //   label: 'Mark selected as unread',
    //   key: '1',
    //   icon: <MarkEmailUnreadOutlinedIcon />,
    //   className: styles.dropdown,
    // },
    {
      label: t('admin_btn_mark_selected_as_read'),
      key: '2',
      icon: <DraftsOutlinedIcon />,
      className: styles.dropdown,
      onClick: () =>
        markNotificationAsRead({ params: { notificationIds: rowIds.map(id => id.toString()) } }),
    },
  ];

  const menuProps: DropdownProps['menu'] = {
    items,
    disabled: !isAnyNotificationMarked,
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize,
    onChange: handleFilterChange('page'),
    size: 'small',
  };

  const handleTableHeaderRender = () => {
    if (isNotificationsCenterPathName) {
      return (
        <div className={styles.tableHeaderContainer}>
          <TableHeader
            title={t('admin_title_notifications_center')}
            searchMenu={searchMenu}
            checkboxMenu={checkboxMenu}
          />
          <div className={styles.dropdownContainer}>
            <Dropdown menu={menuProps} disabled={!isAnyNotificationMarked}>
              <Button>
                <Space>
                  {t('admin_btn_actions')}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
      );
    }

    return (
      <TableHeader
        title={t('admin_title_notifications_center')}
        redirectionMenu={redirectionMenu}
        searchMenu={searchMenu}
        checkboxMenu={checkboxMenu}
      />
    );
  };

  return (
    <TableLayout
      dataSource={data?.details.items}
      rowSelection={
        isNotificationsCenterPathName ? { type: 'checkbox', ...rowSelection } : undefined
      }
      scroll={isNotificationsCenterPathName ? { y: 650 } : { y: 320 }}
      columns={columnData(styles.textBold)}
      pagination={paginationConfig}
      containerClassName={styles.cardContainer}
      isMultilineCell
      loading={isLoading}
      rowKey={item => item.id}
      tableHeader={handleTableHeaderRender()}
    />
  );
};

export default NotificationsCenter;
