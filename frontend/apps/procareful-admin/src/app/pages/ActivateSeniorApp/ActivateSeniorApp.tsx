import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Skeleton, type UploadFile } from 'antd';
import InfoTile from '@ProcarefulAdmin/components/InfoTile';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import AvatarUpload from '@ProcarefulAdmin/components/Upload';
import {
  useCaregiverControllerGenerateQRCode,
  useCaregiverControllerGetSecurityCode,
  useCaregiverControllerSendLandingPageLinkViaEmail,
} from '@Procareful/common/api';
import {
  SearchParams,
  SECURITY_CODE_PLACEHOLDER,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { Paragraph, Text } from '@Procareful/ui';
import { useStyles } from './styles';

const ActivateSeniorApp = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const [qrCode, setQrCode] = useState<UploadFile | null>();
  const [searchParams] = useSearchParams();
  const seniorId = Number(searchParams.get(SearchParams.Id));

  const { data: securityCodeData, isLoading: isSecurityCodeLoading } =
    useCaregiverControllerGetSecurityCode(seniorId);
  const { data: qrCodeData, isLoading: isQRCodeLoading } = useCaregiverControllerGenerateQRCode();
  const { mutate: handleSendLinkViaEmail, isPending: isSendLinkViaEmailPending } =
    useCaregiverControllerSendLandingPageLinkViaEmail({
      mutation: {
        onSuccess: () => {
          notificationApi.success({
            message: t('admin_title_alert_invitation_to_procareful_app'),
            description: t('admin_inf_alert_invitation_to_procareful_app'),
          });
        },
      },
    });

  const securityCode = securityCodeData?.details.security_code;
  const securityCodeTitle = securityCode
    ? t('admin_inf_activate_senior_give_security_code_subtitle')
    : t('admin_inf_activate_senior_missing_security_code_subtitle');

  const handleRenderSecurityCodeContent = () => {
    if (isSecurityCodeLoading) {
      return <Skeleton.Button className={styles.skeleton} size="small" active />;
    }

    return securityCode
      ? securityCode.replace(/(\d{3})(\d{3})/, '$1-$2')
      : SECURITY_CODE_PLACEHOLDER;
  };

  const handleQRCodeRender = () => {
    if (isQRCodeLoading) {
      return <Skeleton.Image active />;
    }

    return (
      <AvatarUpload
        defaultFile={qrCode}
        disabled
        uploadClassName={styles.qrCode}
        previewImageStyle={styles.qrCodeImage}
        isPreview
      />
    );
  };

  const handleSendEmailLink = () => {
    handleSendLinkViaEmail({ userId: seniorId });
  };

  useEffect(() => {
    if (qrCodeData?.details)
      setQrCode({
        uid: '-1',
        name: 'QRCode.jpeg',
        status: 'done',
        size: qrCodeData?.details.length,
        url: qrCodeData?.details,
      });
  }, [qrCodeData?.details]);

  return (
    <StyledCard title={t('admin_title_setup_senior')} className={styles.cardContainer}>
      <InfoTile
        title={t('admin_title_activate_senior_scan_code')}
        subtitle={t('admin_inf_activate_senior_scan_code_subtitle')}
        index={1}
        containerStyle={styles.itemContainer}
        variant="div"
      >
        <div className={styles.qrCodeContainer}>
          {handleQRCodeRender()}
          <div className={styles.textContainer}>
            <Paragraph>{t('admin_inf_send_activation_link')}</Paragraph>
            <Button
              type="default"
              className={styles.sendLinkButton}
              onClick={handleSendEmailLink}
              loading={isSendLinkViaEmailPending}
            >
              {t('admin_btn_send_link_via_email')}
            </Button>
          </div>
        </div>
      </InfoTile>
      <InfoTile
        title={t('admin_title_activate_senior_give_security_code')}
        subtitle={securityCodeTitle}
        index={2}
        containerStyle={styles.itemContainer}
        variant="div"
      >
        <div className={cx(styles.textContainer, styles.securityCodeContainer)}>
          <Text className={styles.securityCodeTitle}>{t('admin_inf_security_code')}</Text>
          <Text className={cx(styles.securityCode, { [styles.securityCodeBold]: !!securityCode })}>
            {handleRenderSecurityCodeContent()}
          </Text>
        </div>
      </InfoTile>
      <InfoTile
        title={t('admin_title_activate_senior_need_support')}
        subtitle={t('admin_inf_activate_senior_need_support_subtitle')}
        index={3}
        containerStyle={styles.itemContainer}
        variant="div"
      />
    </StyledCard>
  );
};

export default ActivateSeniorApp;
