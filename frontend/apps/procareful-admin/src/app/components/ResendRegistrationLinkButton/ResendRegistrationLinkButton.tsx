import { forwardRef } from 'react';
import { Button, Spin } from 'antd';
import { useAdminControllerResendActivationLink } from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { useStyles } from './styles';

type ResendRegistrationLinkButtonProps = {
  userId: number;
  className?: string;
};

const ResendRegistrationLinkButton = (
  { userId, className }: ResendRegistrationLinkButtonProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();

  const { mutate: resendActivationLink, isPending } = useAdminControllerResendActivationLink({
    mutation: {
      onSuccess: () => {
        notificationApi.success({
          message: t('admin_alert_activation_link_title'),
          description: t('admin_alert_activation_link_subtitle'),
        });
      },
    },
  });

  const handleSendActivationLink = () =>
    resendActivationLink({
      adminId: userId,
    });

  return (
    <div ref={ref} className={cx(styles.container, className)}>
      <Button
        type="text"
        onClick={handleSendActivationLink}
        disabled={isPending}
        className={styles.button}
      >
        <Spin size="small" className={cx(styles.spin, { [styles.spinVisible]: isPending })} />
        {t('admin_btn_resend_registration_link')}
      </Button>
    </div>
  );
};

export default forwardRef(ResendRegistrationLinkButton);
