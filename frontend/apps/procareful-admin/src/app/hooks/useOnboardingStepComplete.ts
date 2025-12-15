import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOnboardingStore } from '@ProcarefulAdmin/store/onboardingStore';
import { type StepKeysOnly } from '@ProcarefulAdmin/typings';
import {
  type GetOnboardingStepStatusResponseDtoDetails,
  useAdminInstitutionControllerUpdateOnboardingSteps,
  type GetOnboardingStepsDto,
  getAdminInstitutionControllerGetOnboardingStepsQueryKey,
  type GetOnboardingDto,
} from '@Procareful/common/api';
import { SearchParams } from '@Procareful/common/lib';

type StepsDto = StepKeysOnly<GetOnboardingStepStatusResponseDtoDetails>;
export type StepKey = keyof StepsDto;

export const useOnboardingStepComplete = () => {
  const [searchParams] = useSearchParams();
  const stepOrder = searchParams.get(SearchParams.StepOrder);
  const stepOrderNumber = Number(stepOrder);
  const queryClient = useQueryClient();
  const hasFetched = useRef(false);

  const { setOnboardingSuccessModalVisibility } = useOnboardingStore(state => ({
    setOnboardingSuccessModalVisibility: state.setOnboardingSuccessModalVisibility,
  }));

  const onboardingStepsData: GetOnboardingStepsDto | undefined = queryClient.getQueryData(
    getAdminInstitutionControllerGetOnboardingStepsQueryKey()
  );
  const steps = onboardingStepsData?.details;

  const { mutate: updateOnboardingStep } = useAdminInstitutionControllerUpdateOnboardingSteps({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAdminInstitutionControllerGetOnboardingStepsQueryKey(),
        });
      },
    },
  });

  useEffect(() => {
    if (hasFetched.current || !stepOrderNumber || !steps) {
      return;
    }

    const step = `step${stepOrderNumber}` as StepKey;
    const isStepCompleted = Boolean(steps?.[step]);

    if (!isStepCompleted) {
      updateOnboardingStep({ step: stepOrderNumber });
      hasFetched.current = true;
    }

    if (isLastFalseStep(steps, step)) {
      setOnboardingSuccessModalVisibility(true);
    }
  }, [stepOrderNumber, steps, updateOnboardingStep, setOnboardingSuccessModalVisibility]);

  return { isOnboardingPage: Boolean(stepOrder) };
};

const isLastFalseStep = (steps: GetOnboardingDto, currentStepKey: string) => {
  // If the current step is not false, it cannot be the last false step.
  if (steps?.[currentStepKey as StepKey] !== false) {
    return false;
  }

  // Count how many steps are still false, excluding the current step.
  const totalFalseSteps = Object.values(steps).reduce(
    (count, value) => count + (value === false ? 1 : 0),
    0
  );

  // If there's exactly one false step and it's the current one, then it's the last false step.
  return totalFalseSteps === 1;
};
