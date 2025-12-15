import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Avatar, Divider } from 'antd';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { seniorRelationMap } from '@ProcarefulAdmin/constants/supportingContactRelationMap';
import {
  type GetSupportingContactDto,
  type GetFamilyDoctorDtoContact,
} from '@Procareful/common/api';
import { formatPhoneToDisplay } from '@Procareful/common/lib';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Text } from '@Procareful/ui';
import { sortByInformalCaregiver } from '../helpers';
import SupportingContact from './SupportingContact';
import { useStyles } from './styles';

type SeniorPropertiesProps = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  street?: string;
  zipCode?: string;
  city?: string;
  building?: string;
  avatarImage?: string;
  supportingContacts?: GetSupportingContactDto[];
  familyDoctor?: GetFamilyDoctorDtoContact;
};

const SUPPORTING_CONTACTS_COUNT_LIMIT = 2;
const FULL_NAME_BREAKING_THRESHOLD = 33;

export const SeniorProperties = ({
  firstName,
  lastName,
  phoneNumber,
  emailAddress,
  street,
  zipCode,
  city,
  building,
  avatarImage,
  supportingContacts,
  familyDoctor,
}: SeniorPropertiesProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' });

  const { id, first_name, last_name, phone_number, email_address } = familyDoctor || {};
  const showAddressSection = street || building || zipCode || city;
  const showSupportingSection = supportingContacts?.length || familyDoctor;
  const showDivider = showSupportingSection || (showAddressSection && showSupportingSection);

  const isFullDataColumn = Boolean(
    (supportingContacts?.length === SUPPORTING_CONTACTS_COUNT_LIMIT &&
      supportingContacts.every(
        ({ contact: { email_address, phone_number } }) => email_address && phone_number
      ) &&
      familyDoctor?.email_address) ||
      familyDoctor?.phone_number
  );

  const isHorizontalAlignment = !isBigScreen && isFullDataColumn;
  const fullName = `${firstName} ${lastName}`;

  const sortedContacts = useMemo(
    () => sortByInformalCaregiver(supportingContacts),
    [supportingContacts]
  );

  const renderSeniorText = () => (
    <Text
      className={cx(styles.senior, styles.seniorWithOneMissingData, {
        [styles.seniorWithFullData]: !!phoneNumber && !!emailAddress,
      })}
    >
      {t('admin_table_senior')}
    </Text>
  );

  const renderAddressSection = () => {
    const hasAddress = Boolean(street || building || zipCode || city);

    if (!hasAddress) {
      return <Text className={styles.addressPlaceholder}>{t('admin_title_not_provided')}</Text>;
    }

    return (
      <>
        <Text>
          {street} {building}
        </Text>
        <Text>
          {zipCode} {city}
        </Text>
      </>
    );
  };

  return (
    <StyledCard fullHeight className={styles.cardContainer}>
      <div className={styles.container}>
        <div className={styles.contactDataContainer}>
          <div
            className={cx(styles.basicInfoContainer, {
              [styles.horizontalAlignment]: !isBigScreen && isFullDataColumn,
              [styles.verticalAlignment]: isBigScreen || !isFullDataColumn,
            })}
          >
            <div>
              <Avatar
                size={{ xxl: 90, xl: isFullDataColumn && !isBigScreen ? 60 : 70, lg: 80, md: 80 }}
                src={`data:image/jpeg;base64,${avatarImage}`}
                alt={`${firstName} profile`}
                className={styles.avatar}
              >
                {!avatarImage && firstName[0]}
              </Avatar>
            </div>
            <div>
              <div>
                <Text
                  strong
                  className={cx(styles.seniorName, {
                    [styles.smallerFontSize]:
                      fullName.length > FULL_NAME_BREAKING_THRESHOLD && isHorizontalAlignment,
                  })}
                >
                  {firstName} {lastName}
                </Text>
              </div>
              {isFullDataColumn && renderSeniorText()}
            </div>
            {!isFullDataColumn && renderSeniorText()}
          </div>
          <div className={styles.sectionContainer}>
            {phoneNumber && <Text>{formatPhoneToDisplay(phoneNumber)}</Text>}
            <Text>{emailAddress}</Text>
          </div>
          <div className={cx(styles.sectionContainer, styles.addressContainer)}>
            <Text strong className={styles.sectionTitle}>
              {t('admin_inf_address')}
            </Text>
            {renderAddressSection()}
          </div>
          {showDivider && <Divider className={styles.divider} />}
          {showSupportingSection && (
            <div className={styles.sectionContainer}>
              <Text strong className={cx(styles.sectionTitle, styles.supportingTitleMargin)}>
                {t('admin_title_supporting_contacts')}
              </Text>
              {sortedContacts?.map(
                ({
                  contact: { id, first_name, last_name, phone_number, email_address, relation },
                }) => (
                  <SupportingContact
                    key={id}
                    firstName={first_name || ''}
                    lastName={last_name || ''}
                    phoneNumber={phone_number || ''}
                    emailAddress={email_address || ''}
                    relation={
                      relation?.map(relation => seniorRelationMap[relation.relations]).join(', ') ||
                      ''
                    }
                  />
                )
              )}
              {familyDoctor && (
                <SupportingContact
                  key={id}
                  firstName={first_name || ''}
                  lastName={last_name || ''}
                  phoneNumber={phone_number || ''}
                  emailAddress={email_address || ''}
                  relation={t('admin_title_stepper_family_doctor')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </StyledCard>
  );
};

export default SeniorProperties;
