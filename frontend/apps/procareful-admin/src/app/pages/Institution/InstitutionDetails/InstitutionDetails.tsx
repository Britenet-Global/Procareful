import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import InstitutionDetailsForm from '@ProcarefulAdmin/components/forms/InstitutionDetailsForm';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { useAdminInstitutionControllerGetInstitutionDetails } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';

const InstitutionDetails = () => {
  const { t } = useTypedTranslation();
  const { isOnboardingPage } = useOnboardingStepComplete();
  const { isDirty } = useFormDirtyStore(state => ({
    isDirty: state.isDirty(),
  }));

  const { data: institutionData, isLoading } = useAdminInstitutionControllerGetInstitutionDetails();
  const { name, city, street, building, flat, zip_code, phone, email } =
    institutionData?.details || {};

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <StyledCard title={t('admin_title_institution_details')}>
        <InstitutionDetailsForm
          name={name || ''}
          city={city || ''}
          street={street || ''}
          building={building || ''}
          flat={flat || ''}
          zipCode={zip_code || ''}
          phoneNumber={phone || ''}
          emailAddress={email || ''}
        />
      </StyledCard>
      <NavigationBlockerModal shouldBlock={isDirty && isOnboardingPage} />
    </>
  );
};

export default InstitutionDetails;
