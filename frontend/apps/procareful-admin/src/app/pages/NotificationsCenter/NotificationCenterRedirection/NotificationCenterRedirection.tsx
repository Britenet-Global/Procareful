import { useQueryClient } from '@tanstack/react-query';
import { Link, type LinkProps } from 'react-router-dom';
import {
  getCaregiverControllerGetMyNotificationsQueryKey,
  getCaregiverControllerGetUnreadNotificationCountQueryKey,
  useCaregiverControllerMarkNotificationsAsRead,
} from '@Procareful/common/api';
import { globalStyles } from '@Procareful/ui';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useStyles } from '../styles';

type NotificationCenterRedirectionProps = {
  notificationId: number;
  linkTo: LinkProps['to'];
};

const NotificationCenterRedirection = ({
  notificationId,
  linkTo,
}: NotificationCenterRedirectionProps) => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();

  const { mutate: markNotificationAsRead } = useCaregiverControllerMarkNotificationsAsRead({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getCaregiverControllerGetUnreadNotificationCountQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getCaregiverControllerGetMyNotificationsQueryKey(),
        });
      },
    },
  });

  const handleMarkNotificationAsRead = () => {
    markNotificationAsRead({ params: { notificationIds: [notificationId.toString()] } });
  };

  return (
    <div className={styles.editIconContainer}>
      <Link
        to={linkTo}
        color={globalStyles.themeColors.colorInfoText}
        className={styles.iconContainer}
        onClick={handleMarkNotificationAsRead}
      >
        <ArrowForwardIosIcon className={styles.editIcon} />
      </Link>
    </div>
  );
};

export default NotificationCenterRedirection;
