import {
  getUserControllerGetActivePersonalGrowthChallengeQueryKey,
  getUserControllerGetBrainPointsQueryKey,
  getUserControllerGetDashboardQueryKey,
  getUserControllerGetPersonalGrowthChallengeQueryKey,
  useUserControllerGetPersonalGrowthChallenge,
  useUserControllerSetPersonalGrowthChallengeToCompleted,
  useUserControllerUpdateBrainPoints,
  useUserControllerUpdateUserFeedback,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { SearchParams, LocalStorageKey } from '@Procareful/common/lib/constants';
import { memorableExperienceFeedbackSchema } from '@ProcarefulApp/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form, Input } from 'antd';
import { type ButtonHTMLType } from 'antd/es/button';
import { getNewSearchParams } from '../helpers';
import { POINTS_REWARD, TEXTAREA_NUMBER_OF_ROWS } from './constants';
import { useStyles } from './styles';

type MemorableExperienceFeedbackData = z.infer<typeof memorableExperienceFeedbackSchema>;

const { TextArea } = Input;

const MemorableExperienceFeedback = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [buttonType, setButtonType] = useState<ButtonHTMLType | null>(null);

  const personalGrowthId = searchParams.get(SearchParams.Id);

  const personalRateFromLocalStorage = localStorage.getItem(LocalStorageKey.PersonalGrowthData);
  const personalRateParsed = personalRateFromLocalStorage
    ? JSON.parse(personalRateFromLocalStorage)
    : {};

  const { data: personalGrowthChallengeData } = useUserControllerGetPersonalGrowthChallenge(
    Number(personalGrowthId),
    {
      query: {
        enabled: Boolean(personalGrowthId),
      },
    }
  );

  const { positive_emotions, stuck_in_memory_the_most } =
    personalGrowthChallengeData?.details || {};

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<MemorableExperienceFeedbackData>({
    resolver: zodResolver(memorableExperienceFeedbackSchema),
    values: {
      stuckInMemoryTheMost: stuck_in_memory_the_most || '',
      positiveEmotions: positive_emotions || '',
    },
  });

  const { mutate: addUserPoints, isPending: isAddUserPointsPending } =
    useUserControllerUpdateBrainPoints({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetBrainPointsQueryKey(),
          });
        },
      },
    });

  const { mutate: markChallengeAsCompleted, isPending: isMarkChallengeAsCompletePending } =
    useUserControllerSetPersonalGrowthChallengeToCompleted({
      mutation: {
        onSuccess: () => {
          addUserPoints({
            data: {
              points: POINTS_REWARD,
            },
          });

          queryClient.invalidateQueries({
            queryKey: getUserControllerGetActivePersonalGrowthChallengeQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetDashboardQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetPersonalGrowthChallengeQueryKey(Number(personalGrowthId)),
          });

          handleNextStepIncrement();
        },
      },
    });

  const { mutate: addUserFeedback, isPending: isAddUserFeedbackPending } =
    useUserControllerUpdateUserFeedback({
      mutation: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: getUserControllerGetPersonalGrowthChallengeQueryKey(Number(personalGrowthId)),
          });
          handleNextStepIncrement();
        },
      },
    });

  const onSubmit = (
    { positiveEmotions, stuckInMemoryTheMost }: MemorableExperienceFeedbackData,
    buttonType: ButtonHTMLType
  ) => {
    if (!personalGrowthId) {
      return;
    }

    setButtonType(buttonType);
    const isSubmitButtonType = buttonType === 'submit';

    const payload = {
      personalGrowthId: Number(personalGrowthId),
      data: {
        personal_rate: personalRateParsed.personalRate,
        positive_emotions: (isSubmitButtonType && positiveEmotions) || undefined,
        stuck_in_memory_the_most: (isSubmitButtonType && stuckInMemoryTheMost) || undefined,
      },
    };

    const isUpdatingFeedback = personalGrowthChallengeData?.details.completed;

    if (isUpdatingFeedback && isDirty) {
      addUserFeedback(payload);

      return;
    }

    if (isUpdatingFeedback && !isDirty) {
      handleNextStepIncrement();

      return;
    }

    markChallengeAsCompleted(payload);
  };

  const handleNextStepIncrement = () => {
    if (!personalGrowthId) {
      return;
    }

    const newSearchParams = getNewSearchParams({ searchParams, stepNumber: 3, personalGrowthId });
    setSearchParams(newSearchParams, { replace: true });
  };

  const isMutationPending =
    isMarkChallengeAsCompletePending || isAddUserPointsPending || isAddUserFeedbackPending;

  return (
    <Form className={styles.container} layout="vertical">
      <FormItem
        control={control}
        name="stuckInMemoryTheMost"
        label={t('senior_form_stuck_in_memory_the_most')}
      >
        <TextArea rows={TEXTAREA_NUMBER_OF_ROWS} />
      </FormItem>
      <FormItem
        control={control}
        name="positiveEmotions"
        label={t('senior_form_positive_emotions')}
      >
        <TextArea rows={TEXTAREA_NUMBER_OF_ROWS} />
      </FormItem>
      <div className={styles.buttonContainer}>
        <Button
          onClick={handleSubmit(data => onSubmit(data, 'submit'))}
          type="primary"
          htmlType="submit"
          disabled={!isDirty}
          size="large"
          loading={buttonType === 'submit' && isMutationPending}
        >
          {t('shared_btn_save')}
        </Button>
        <Button
          onClick={handleSubmit(data => onSubmit(data, 'button'))}
          size="large"
          htmlType="button"
          loading={buttonType === 'button' && isMutationPending}
        >
          {t('senior_btn_do_it_later')}
        </Button>
      </div>
    </Form>
  );
};

export default MemorableExperienceFeedback;
