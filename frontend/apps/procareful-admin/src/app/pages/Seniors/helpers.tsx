import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { TableUserCell } from '@ProcarefulAdmin/components/TableLayout';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { tagColor, tagStatus } from '@ProcarefulAdmin/constants/tagStatus';
import { type GetUsersForCaregiverWithImageDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { SearchParams, TimeFormat } from '@Procareful/common/lib';
import { Text, Tag } from '@Procareful/ui';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styles } from './styles';

export const columnData: TableProps<GetUsersForCaregiverWithImageDto>['columns'] = [
  {
    get title() {
      return i18n.t('admin_form_name');
    },
    dataIndex: 'user',
    key: 'user',
    width: '50%',
    render: (_, { first_name, last_name, image, id }) => (
      <TableUserCell key={id} userName={`${first_name} ${last_name}`} imageUrl={image} />
    ),
  },
  {
    get title() {
      return i18n.t('admin_table_start_date');
    },
    dataIndex: 'startDate',
    key: 'startDate',
    width: '15%',
    render: (_, { created_at }) => {
      const formattedDate = dayjs(created_at).format(TimeFormat.DATE_FORMAT);

      return <Text>{formattedDate}</Text>;
    },
  },
  {
    get title() {
      return i18n.t('admin_form_status');
    },
    dataIndex: 'status',
    key: 'status',
    width: '30%',

    render: (_, { status, assessment_completed, activities_assigned }) => (
      <div className={cx(styles.tagContainer)}>
        <Tag customColor={tagColor[status.status_name]}>{tagStatus[status.status_name]}</Tag>
        {!assessment_completed && (
          <Tag customColor="red">{i18n.t('admin_alert_no_assessment')}</Tag>
        )}
        {!activities_assigned && (
          <Tag customColor="red">{i18n.t('admin_inf_activities_not_assigned')}</Tag>
        )}
      </div>
    ),
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: '5%',
    render: (_, { id }) => {
      const queryParams = new URLSearchParams({
        [SearchParams.Id]: id.toString(),
      }).toString();

      return (
        <Link to={{ pathname: PathRoutes.SeniorProfile, search: queryParams }}>
          <ChevronRightIcon className={cx(styles.chevronIcon)} />
        </Link>
      );
    },
  },
];
