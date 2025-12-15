import UserOutlined from '@ant-design/icons/UserOutlined';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, Badge, Dropdown, type MenuProps, Space } from 'antd';
import type { BadgeProps } from 'antd/lib';
import { PathRoutes } from '@ProcarefulAdmin/constants/enums';
import { useUserCredentialsStore } from '@ProcarefulAdmin/store/userCredentialsStore';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  type GetAdminDto,
  useAuthControllerLogout,
  AdminRolesDtoRoleName,
  getAuthControllerGetMeQueryKey,
  type GetImageResponseDto,
  CaregiverControllerGetMyNotificationsFilterTitle,
  useCaregiverControllerGetUnreadNotificationCount,
} from '@Procareful/common/api';
import { SearchParams } from '@Procareful/common/lib';
import { type Key, useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Title } from '@Procareful/ui';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { pathNames } from './constants';
import { useStyles } from './styles';
import { useServerSentEvents } from './useServerSentEvents';

type TopBarProps = {
  firstName?: GetAdminDto['first_name'];
  roles?: GetAdminDto['roles'];
  avatar?: GetImageResponseDto['details'];
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const NOTIFICATION_OPTIONS: CaregiverControllerGetMyNotificationsFilterTitle[] = Object.values(
  CaregiverControllerGetMyNotificationsFilterTitle
);
const EVENT_URL = `${BASE_URL}/api/admin/caregiver/notifications/subscribe?title=${NOTIFICATION_OPTIONS}`;

export const TopBar = ({ firstName, roles, avatar }: TopBarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();

  const isHeadAdmin = verifyAccessByRole(AdminRolesDtoRoleName.headAdmin, roles);
  const [searchParams] = useSearchParams();
  const seniorId = searchParams.get(SearchParams.Id);
  const pageTitleParam = searchParams.get(SearchParams.PageTitle);
  const pageStepParam = searchParams.get(SearchParams.StepOrder);

  const headerTitle = pageTitleParam
    ? decodeURIComponent(pageTitleParam)
    : t(pathNames[pathname]?.title as Key) || null;

  const showBackArrow = pageTitleParam || pageStepParam || Boolean(pathNames[pathname]?.showArrow);

  const { resetStore } = useUserCredentialsStore(state => ({
    resetStore: state.resetStore,
  }));

  const isCaregiver = verifyAccessByRole(
    [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
    roles
  );
  const { data: unreadNotificationCount } = useCaregiverControllerGetUnreadNotificationCount({
    query: {
      enabled: isCaregiver,
    },
  });

  const [notificationData, setNotificationData] = useState<number>(
    unreadNotificationCount?.details || 0
  );

  useServerSentEvents(EVENT_URL, setNotificationData, isCaregiver);

  const badgeOffset = (
    notificationData && notificationData > 9 ? [5, 3] : [0, 3]
  ) as BadgeProps['offset'];

  const { mutate: logout } = useAuthControllerLogout({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAuthControllerGetMeQueryKey(),
        });
        queryClient.clear();
        resetStore();
        navigate(PathRoutes.Login);
      },
    },
  });

  const handleGoBack = () => {
    // TODO: Apply logic with proper redirection for all the application routes
    if (pathname === PathRoutes.SeniorAddSupportingContacts && seniorId) {
      navigate({
        pathname: PathRoutes.SeniorProfile,
        search: new URLSearchParams({
          [SearchParams.Id]: seniorId,
        }).toString(),
      });

      return;
    }

    if (pathname.includes(PathRoutes.SeniorEditProfileEditSchedule) && seniorId) {
      navigate({
        pathname: PathRoutes.SeniorProfile,
        search: new URLSearchParams({
          [SearchParams.Id]: seniorId?.toString(),
          [SearchParams.Name]: t('admin_title_care_plan'),
        }).toString(),
      });

      return;
    }

    navigate(-1);
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: '1',
      label: t('admin_inf_manage_account'),
      onClick: () => navigate(PathRoutes.ManageYourProfile),
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: t('admin_inf_logout'),
      danger: true,
      onClick: () => logout(),
    },
  ];

  useEffect(() => {
    if (unreadNotificationCount === undefined || !isCaregiver) {
      return;
    }

    setNotificationData(unreadNotificationCount.details);
  }, [unreadNotificationCount, setNotificationData, isCaregiver]);

  const renderHeaderItem = () => {
    const greeting = headerTitle ?? (
      <>
        <span role="img" aria-label="hand img" className={styles.hand}>
          👋
        </span>
        <span>{t('admin_title_greeting')}</span>
        {!isHeadAdmin && firstName && <span>{`, ${firstName}!`}</span>}
      </>
    );

    return (
      <Space className={styles.greetingContainer}>
        {showBackArrow && <ArrowBackOutlinedIcon onClick={handleGoBack} className={styles.arrow} />}
        <Title level={4}>{greeting}</Title>
      </Space>
    );
  };

  const handleRenderNotificationIcon = () => {
    if (!isCaregiver) {
      return;
    }

    if (!notificationData) {
      return (
        <Link to={PathRoutes.NotificationsCenter}>
          <NotificationsNoneOutlinedIcon className={styles.icon} />
        </Link>
      );
    }

    return (
      <Link to={PathRoutes.NotificationsCenter}>
        <Badge
          offset={badgeOffset}
          className={styles.dot}
          count={notificationData}
          overflowCount={9}
        >
          <NotificationsNoneOutlinedIcon className={styles.icon} />
        </Badge>
      </Link>
    );
  };

  return (
    <Space className={styles.container}>
      {renderHeaderItem()}
      <Space className={styles.iconContainer}>
        {handleRenderNotificationIcon()}
        <Dropdown
          overlayClassName={styles.dropdown}
          className={styles.dropdownContainer}
          menu={{ items: dropdownItems }}
          trigger={['click']}
        >
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={avatar ? `data:image/jpeg;base64,${avatar}` : undefined}
          />
        </Dropdown>
      </Space>
    </Space>
  );
};

export default TopBar;
