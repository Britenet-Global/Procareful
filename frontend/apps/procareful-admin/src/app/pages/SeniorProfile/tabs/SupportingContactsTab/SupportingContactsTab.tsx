import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import AddSupportingContacts from '@ProcarefulAdmin/components/forms/AddSupportingContacts';
import FamilyDoctor from '@ProcarefulAdmin/components/forms/FamilyDoctor';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Title } from '@Procareful/ui';
import { useStyles } from './styles';

const SupportingContactsTab = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  return (
    <StyledCard
      title={t('admin_title_supporting_contacts')}
      subtitle={t('admin_inf_edit_supporting_contacts_subtitle')}
      className={styles.cardContainer}
      fullHeight
    >
      <AddSupportingContacts />
      <div className={styles.familyDoctorContainer}>
        <Title level={5}>{t('admin_title_stepper_family_doctor')}</Title>
        <FamilyDoctor />
      </div>
    </StyledCard>
  );
};

export default SupportingContactsTab;
