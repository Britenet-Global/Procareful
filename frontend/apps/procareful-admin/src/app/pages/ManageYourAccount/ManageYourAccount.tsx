import { useQueryClient } from '@tanstack/react-query';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  AdminRolesDtoRoleName,
  getAuthControllerGetMeQueryKey,
  type GetMeResponseDto,
} from '@Procareful/common/api';
import ChangePassword from './ChangePassword';
import PersonalInfoForCaregivers from './PersonalInfoForCaregivers';
import PersonalInfoForInstitutions from './PersonalInfoForInstitutions';
import { useStyles } from './styles';

const ManageYourAccount = () => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();
  const { isDirty } = useFormDirtyStore(state => ({
    isDirty: state.isDirty(),
  }));
  const { isOnboardingPage } = useOnboardingStepComplete();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const renderPersonalInfoForm = () => {
    const isUserHeadAdmin = verifyAccessByRole(
      AdminRolesDtoRoleName.headAdmin,
      userData?.details.admin.roles
    );

    if (isUserHeadAdmin) {
      return null;
    }

    const isUserCaregiver = verifyAccessByRole(
      [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
      userData?.details.admin.roles
    );

    return isUserCaregiver ? <PersonalInfoForCaregivers /> : <PersonalInfoForInstitutions />;
  };

  return (
    <div className={styles.container}>
      {renderPersonalInfoForm()}
      <ChangePassword />
      <NavigationBlockerModal shouldBlock={isDirty && isOnboardingPage} />
    </div>
  );
};

export default ManageYourAccount;
