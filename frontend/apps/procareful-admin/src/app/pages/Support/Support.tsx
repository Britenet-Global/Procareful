import { useQueryClient } from '@tanstack/react-query';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  AdminRolesDtoRoleName,
  getAuthControllerGetMeQueryKey,
  type GetMeResponseDto,
} from '@Procareful/common/api';
import MocaQuestionnaires from './MocaQuestionnaires';
import SeniorAccessGuide from './SeniorAccessGuide';

const Support = () => {
  const queryClient = useQueryClient();
  useOnboardingStepComplete();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isFormalCaregiver = verifyAccessByRole(
    AdminRolesDtoRoleName.formalCaregiver,
    userData?.details.admin.roles
  );

  return isFormalCaregiver ? <MocaQuestionnaires /> : <SeniorAccessGuide />;
};

export default Support;
