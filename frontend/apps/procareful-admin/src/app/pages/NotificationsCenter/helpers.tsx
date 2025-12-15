import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { TableUserCell } from '@ProcarefulAdmin/components/TableLayout';
import {
  type GetMyNotificationsDto,
  GetMyNotificationsDtoTitle,
  GetMyNotificationsDtoPriority,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { SearchParams } from '@Procareful/common/lib';
import { Text, Tag } from '@Procareful/ui';
import NotificationCenterRedirection from './NotificationCenterRedirection';
import { EXCLAMATION_MARK, notificationTitle, redirectionPaths } from './constants';

dayjs.extend(relativeTime);

const handlePickParams = (title: GetMyNotificationsDtoTitle) => {
  const notesNameParams = new URLSearchParams({
    [SearchParams.Name]: i18n.t('admin_btn_notes'),
  });

  const documentsNameParams = new URLSearchParams({
    [SearchParams.Name]: i18n.t('admin_btn_documents'),
  });

  const scheduleInterviewNameParams = new URLSearchParams({
    [SearchParams.Name]: i18n.t('admin_btn_schedule'),
  });

  switch (title) {
    case GetMyNotificationsDtoTitle.new_note_added:
      return `&${notesNameParams}`;
    case GetMyNotificationsDtoTitle.new_document_uploaded:
      return `&${documentsNameParams}`;
    case GetMyNotificationsDtoTitle.monitoring_visit_request:
      return `&${scheduleInterviewNameParams}`;
    case GetMyNotificationsDtoTitle.new_care_plan_assigned:
      return `&${scheduleInterviewNameParams}`;
    default:
      return '';
  }
};

const handlePickRedirectionPath = (userId: number, title: GetMyNotificationsDtoTitle) => {
  const basePath = redirectionPaths[title];
  const urlParams = handlePickParams(title);

  const userIdParams = new URLSearchParams({
    [SearchParams.Id]: userId.toString(),
  });

  return `${basePath}?${userIdParams}${urlParams}`;
};

export const columnData = (className: string): TableProps<GetMyNotificationsDto>['columns'] => [
  {
    title: '',
    dataIndex: 'priority',
    key: 'priority',
    width: 52,
    align: 'center',
    render: (_, { priority }) => {
      if (priority === GetMyNotificationsDtoPriority.high) {
        return <Tag customColor="red">{EXCLAMATION_MARK}</Tag>;
      }

      return null;
    },
  },
  {
    title: i18n.t('admin_table_added'),
    dataIndex: 'added',
    key: 'added',
    width: 144,
    render: (_, { created_at, displayed }) => {
      const timeFromNotificationCame = dayjs()
        .startOf('day')
        .diff(dayjs(created_at).startOf('day'), 'day');

      return (
        <Text className={cx({ [className]: !displayed })}>
          {timeFromNotificationCame === 0
            ? i18n.t('admin_inf_today')
            : i18n.t('admin_table_days_ago', { days: timeFromNotificationCame })}
        </Text>
      );
    },
  },
  {
    title: i18n.t('admin_table_title'),
    dataIndex: 'title',
    key: 'title',
    render: (_, { title, displayed }) => (
      <Text className={cx({ [className]: !displayed })}>{notificationTitle[title]}</Text>
    ),
  },
  {
    title: i18n.t('admin_table_user'),
    dataIndex: 'user',
    key: 'user',
    render: (_, { user }) => {
      const userName = `${user.first_name} ${user.last_name}`;

      return (
        <TableUserCell
          key={user.id}
          userName={userName}
          imageUrl={user.image_name}
          phoneNumber={user.phone_number}
        />
      );
    },
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: 64,
    render: (_, { id, user, title }) => {
      if (!user.id) {
        return null;
      }

      const linkTo = handlePickRedirectionPath(user.id, title);

      return <NotificationCenterRedirection notificationId={id} linkTo={linkTo} />;
    },
  },
];
