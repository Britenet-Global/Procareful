import { Trans } from 'react-i18next';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Title, Text } from '@Procareful/ui';
import { useStyles } from './styles';

const SeniorAccessGuide = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <StyledCard title={t('admin_title_support_how_to_provide_access')}>
      <div className={styles.textSection}>
        <Title level={6}>{t('admin_inf_support_complete_initial_setup')}</Title>
        <Text>{t('admin_inf_support_condition_assessment_performed')}</Text>
      </div>
      <div className={styles.textSection}>
        <Title level={6}>{t('admin_inf_support_download_senior_app')}</Title>
        <ul>
          <li>
            <Text>
              <Trans>{t('admin_inf_support_if_senior_has_email')}</Trans>
            </Text>
          </li>
          <li>
            <Text strong>
              <Trans>{t('admin_inf_support_if_senior_has_no_email')}</Trans>
            </Text>
          </li>
          <ul className={styles.subBulletList}>
            <li>
              <Trans
                i18nKey={'admin_inf_support_access_senior_profile'}
                components={{
                  seniorsLink: <span>{t('admin_title_seniors')}</span>,
                }}
              />
            </li>
            <li>
              <Text>{t('admin_inf_support_assist_your_senior_in_getting_connected')}</Text>
            </li>
            <li>
              <Text>{t('admin_inf_support_scan_qr_code')}</Text>
            </li>
          </ul>
        </ul>
      </div>
      <div className={styles.textSection}>
        <Title level={6}>{t('admin_inf_support_register_on_the_app')}</Title>
        <ul>
          <li>
            <Text>{t('admin_inf_support_register_on_the_app_subtitle')}</Text>
          </li>
        </ul>
      </div>
      <div className={styles.textSection}>
        <Title level={6}>{t('admin_inf_support_enter_six_digit_code')}</Title>
        <ul>
          <li>
            <Text>
              <Trans>{t('admin_inf_support_has_code_in_email')}</Trans>
            </Text>
          </li>
          <li>
            <Text>
              <Trans>{t('admin_inf_support_has_code_below_qr_code')}</Trans>
            </Text>
          </li>
        </ul>
      </div>
      <div className={styles.textSection}>
        <Title level={6}>{t('admin_inf_support_complete_setup')}</Title>
        <Text>{t('admin_inf_support_complete_setup_subtitle')}</Text>
      </div>
    </StyledCard>
  );
};

export default SeniorAccessGuide;
