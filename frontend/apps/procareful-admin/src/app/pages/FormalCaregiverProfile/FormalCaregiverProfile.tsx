import { Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, Tag } from 'antd';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useCaregiverControllerGetFormalCaregiver } from '@Procareful/common/api';
import {
  formatPhoneToDisplay,
  type Key,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { formatTimeRange } from './helpers';
import { useStyles } from './styles';

const FormalCaregiverProfile = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const formalCaregiverId = Number(searchParams.get(SearchParams.Id));

  const { data: formalCaregiverData } = useCaregiverControllerGetFormalCaregiver(formalCaregiverId);

  const { address, formalCaregiver } = formalCaregiverData?.details || {};
  const {
    avatar,
    caregiver_roles = [],
    first_name,
    last_name,
    phone_number,
    email_address,
    workingHours,
  } = formalCaregiver || {};

  const { city, street, zip_code, building } = address || {};

  const showContactSection = Boolean(email_address || phone_number);

  const renderAddressSection = () => {
    const hasAddress = Boolean(street || building || zip_code || city);

    if (!hasAddress) {
      return <Text className={styles.addressPlaceholder}>{t('admin_title_not_provided')}</Text>;
    }

    return (
      <>
        <Text>
          {street} {building}
        </Text>
        <Text>
          {zip_code} {city}
        </Text>
      </>
    );
  };

  const renderCaregiverRoles = () => {
    if (!caregiver_roles || caregiver_roles.length === 0) {
      return (
        <Text className={styles.noDataPlaceholderText}>{t('admin_inf_role_not_provided')}</Text>
      );
    }

    return caregiver_roles.map((role, index) => (
      <Tag key={index} className={styles.tag}>
        {t(`admin_title_caregiver_role_${role.role_name}`)}
      </Tag>
    ));
  };

  const renderWorkingHours = () => {
    if (!workingHours || !workingHours.days || workingHours.days.length === 0) {
      return (
        <Text className={styles.noDataPlaceholderText}>
          {t('admin_inf_working_hours_not_provided')}
        </Text>
      );
    }

    return workingHours.days.map(({ start, end, name }, index) => (
      <Fragment key={index}>
        <Text strong>{t(`admin_form_${name?.toLocaleLowerCase()}` as Key)}</Text>
        <Text>{formatTimeRange(start, end)}</Text>
      </Fragment>
    ));
  };

  return (
    <div className={styles.container}>
      <section className={styles.left}>
        <StyledCard fullHeight>
          <div className={styles.avatarContainer}>
            <Avatar
              size={{ xxl: 90, xl: 80, lg: 80, md: 88 }}
              src={`data:image/jpeg;base64,${avatar}`}
              alt={`${first_name} profile`}
              className={styles.avatar}
            >
              {!avatar && first_name?.[0]}
            </Avatar>
            <Text className={styles.name} strong>{`${first_name} ${last_name}`}</Text>
          </div>
          <Text className={styles.formalCaregiverTitle}>{t('admin_title_formal_caregiver')}</Text>
          {showContactSection && (
            <div className={styles.sectionContainer}>
              {phone_number && <Text>{formatPhoneToDisplay(phone_number)}</Text>}
              {email_address && <Text>{email_address}</Text>}
            </div>
          )}
          <div className={cx(styles.sectionContainer, styles.addressContainer)}>
            <Text strong className={styles.sectionTitle}>
              {t('admin_inf_address')}
            </Text>
            {renderAddressSection()}
          </div>
        </StyledCard>
      </section>
      <section className={styles.right}>
        <StyledCard title={t('admin_title_role')}>
          <div className={styles.tagContainer}>{renderCaregiverRoles()}</div>
        </StyledCard>
        <StyledCard
          title={t('admin_inf_working_hours')}
          subtitle={t('admin_inf_working_hours_subtitle')}
        >
          <div className={styles.workingHoursContainer}>{renderWorkingHours()}</div>
        </StyledCard>
      </section>
    </div>
  );
};

export default FormalCaregiverProfile;
