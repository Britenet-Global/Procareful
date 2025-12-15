import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import InstitutionDetailsForm from '@ProcarefulAdmin/components/forms/InstitutionDetailsForm';
import WorkingHours from '@ProcarefulAdmin/components/forms/WorkingHours';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import {
  useAdminInstitutionControllerGetInstitutionDetails,
  type UpdateCaregiverRoleDtoRoleNameItem,
  useAdminInstitutionControllerGetFormalCaregiverRoles,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import Role from './Role';
import { useStyles } from './styles';

const ProfessionalProfile = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { isOnboardingPage } = useOnboardingStepComplete();
  const { isDirty } = useFormDirtyStore(state => ({
    isDirty: state.isDirty(),
  }));

  const { data: institutionData } = useAdminInstitutionControllerGetInstitutionDetails();
  const { name, city, street, building, flat, zip_code, phone, email } =
    institutionData?.details || {};

  const { data: caregiverRolesData, isLoading } =
    useAdminInstitutionControllerGetFormalCaregiverRoles();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className={styles.container}>
        <Role
          position={
            (caregiverRolesData?.details as unknown as UpdateCaregiverRoleDtoRoleNameItem[]) || []
          }
        />
        <WorkingHours />
        <StyledCard title={t('admin_title_institution')}>
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
      </div>
      <NavigationBlockerModal shouldBlock={isDirty && isOnboardingPage} />
    </>
  );
};

export default ProfessionalProfile;
