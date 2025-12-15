import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Col, Divider, Row } from 'antd';
import { getInitialRoute } from '@ProcarefulAdmin/utils/getInitialRoute';
import { type GetMeResponseDto, getAuthControllerGetMeQueryKey } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { AuthCard, Paragraph } from '@Procareful/ui';
import { getConfigForRoles } from './helpers';
import { useStyles } from './styles';

const OnboardingEntry = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );
  const { first_name, roles } = userData?.details.admin || {};

  const handleConfirm = () => {
    const initialRoute = getInitialRoute(true, true, roles);

    navigate(initialRoute, { replace: true });
  };

  const title = `${t('admin_title_welcome')}${first_name ? ` ${first_name}!` : '!'}`;

  const welcomeCardItems = getConfigForRoles(userData?.details.admin.roles);

  return (
    <AuthCard containerClassName={styles.container}>
      <AuthCard.Header className={styles.header}>{title}</AuthCard.Header>
      <div className={styles.subtitle}>
        <Paragraph>{t('admin_inf_onboarding_welcome_part_1')}</Paragraph>
        <Paragraph>{t('admin_inf_onboarding_welcome_part_2')}</Paragraph>
      </div>
      <Divider className={styles.divider} />
      <div>
        {welcomeCardItems?.map(({ icon: Icon, text }, index) => (
          <Row key={index} className={styles.row}>
            <Col span={3}>
              <Icon className={styles.icon} />
            </Col>
            <Col span={21} className={styles.iconTextColumn}>
              <Paragraph>{text}</Paragraph>
            </Col>
          </Row>
        ))}
      </div>
      <AuthCard.SubmitButton onClick={handleConfirm}>
        {t('shared_btn_continue')}
      </AuthCard.SubmitButton>
      <AuthCard.TermsAndPrivacyPolicy i18nKey="admin_inf_register_agreement_text" />
    </AuthCard>
  );
};

export default OnboardingEntry;
