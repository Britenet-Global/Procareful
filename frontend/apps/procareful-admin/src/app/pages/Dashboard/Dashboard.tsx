import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type RadioChangeEvent } from 'antd';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import { useOnboardingStore } from '@ProcarefulAdmin/store/onboardingStore';
import {
  AdminRolesDtoRoleName,
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  useAdminInstitutionControllerGetOnboardingSteps,
} from '@Procareful/common/api';
import { LocalStorageKey, useTypedTranslation } from '@Procareful/common/lib';
import Onboarding from './Onboarding';
import RoleToggler from './RoleToggler';
import { dashboardBasedOnRole } from './helpers';
import { useStyles } from './styles';

export type InstitutionAdminAndFormalCaregiver =
  | AdminRolesDtoRoleName.adminInstitution
  | AdminRolesDtoRoleName.formalCaregiver;

const Dashboard = () => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();
  const { t } = useTypedTranslation();

  const [selectedRole, setSelectedRole] = useState(
    (localStorage.getItem(LocalStorageKey.Role) as InstitutionAdminAndFormalCaregiver) ||
      AdminRolesDtoRoleName.formalCaregiver
  );
  const { isOnboardingSuccessModalOpen, setOnboardingSuccessModalVisibility } = useOnboardingStore(
    state => ({
      isOnboardingSuccessModalOpen: state.isOnboardingSuccessModalOpen,
      setOnboardingSuccessModalVisibility: state.setOnboardingSuccessModalVisibility,
    })
  );

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isOnboardingCompleted = userData?.details.onboardingCompleted;

  const { data: onboardingStepsData, isLoading } = useAdminInstitutionControllerGetOnboardingSteps({
    query: {
      enabled: !isOnboardingCompleted,
    },
  });

  const handleRoleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSelectedRole(value);
    localStorage.setItem(LocalStorageKey.Role, value);
  };

  const onboardingSteps = onboardingStepsData?.details;
  const hasUserFewRoles = userData && userData.details.admin.roles.length > 1;
  const showOnboardingSection =
    !isOnboardingSuccessModalOpen && !isOnboardingCompleted && onboardingSteps;

  const handleModalVisibility = () => {
    setOnboardingSuccessModalVisibility(false);
  };

  const getRole = () => {
    if (hasUserFewRoles) {
      return selectedRole;
    }

    return userData?.details.admin.roles[0].role_name;
  };

  return (
    <div className={styles.overflowContainer}>
      {hasUserFewRoles && <RoleToggler value={selectedRole} onChange={handleRoleChange} />}
      {showOnboardingSection && <Onboarding steps={onboardingSteps} isLoading={isLoading} />}
      {dashboardBasedOnRole[getRole() as AdminRolesDtoRoleName]}
      <PromptModal
        type="success"
        open={isOnboardingSuccessModalOpen}
        title={t('admin_title_onboarding_complete')}
        notificationContent={{
          header: t('admin_title_onboarding_complete_header'),
          description: t('admin_title_onboarding_complete_content'),
        }}
        showCancelButton={false}
        confirmButtonText={t('shared_btn_ok')}
        onConfirm={handleModalVisibility}
        onCancel={handleModalVisibility}
        confirmButtonType="default"
        closable
      />
    </div>
  );
};

export default Dashboard;
