import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { type To, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Form } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import {
  PaginationSize,
  PathRoutes,
  PersonalGrowth,
  cognitiveGamesOptions,
  walkingExercisesOptions,
  withoutLimitationsBreathingExercisesOptions,
  withoutLimitationsBreathingLevelOptions,
  withoutLimitationsGrowthChallengesOptions,
  withoutLimitationsPhysicalExercises,
  withoutLimitationsPhysicalLevelOptions,
} from '@ProcarefulAdmin/constants';
import {
  useAssignActivitiesStore,
  type CustomScheduleWithoutLimitations,
} from '@ProcarefulAdmin/store/assignActivitiesStore';
import { customScheduleWithoutLimitationsSchema } from '@ProcarefulAdmin/utils';
import {
  AddGameScoreDtoGameName,
  useCaregiverControllerUpdateCustomScheduleNoLimitations,
  type GetUserScheduleDto,
  type GetUserMobilityLevelRecommendedLevel,
  type ScheduleNoLimitationsDtoPersonalGrowth,
  type ScheduleNoLimitationsDtoUserBreathingExercisesItem,
  type ScheduleNoLimitationsDtoUserPhysicalExercisesItem,
  type ScheduleNoLimitationsDtoBreathingLevel,
  type ScheduleNoLimitationsDtoPhysicalLevel,
  type ScheduleNoLimitationsDtoUserWalkingExercises,
  type ErrorResponse,
  type ScheduleNoLimitationsDto,
  GenerateSchedulesDtoUserMobility,
  type GetWalkingTime,
  getCaregiverControllerGetUserQueryKey,
  getCaregiverControllerGetUserScheduleQueryKey,
} from '@Procareful/common/api';
import { useNotificationContext, useToggle, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { FormBuilder } from '@Procareful/ui';
import { getSeniorCarePlanRedirectConfig, transformExercises } from '../helpers';
import { useStyles } from '../styles';
import CustomScheduleDetailsModal from './../CustomScheduleDetailsModal/CustomScheduleDetailsModal';

type WithoutLimitationsCustomScheduleProps = {
  recommendedLevel: GetUserMobilityLevelRecommendedLevel;
  scheduleData?: GetUserScheduleDto;
  seniorId: number;
  redirectTo: To;
  walkingTime?: GetWalkingTime;
  onConfirmAddSchedule: () => void;
};

const WithoutLimitationsCustomSchedule = ({
  recommendedLevel,
  scheduleData,
  seniorId,
  redirectTo,
  walkingTime,
  onConfirmAddSchedule,
}: WithoutLimitationsCustomScheduleProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const isEditScheduleRoute = location.pathname === PathRoutes.SeniorEditProfileEditSchedule;
  const fetchedBreathingExercises = scheduleData?.user_breathing_exercises.map(
    exercise => exercise.name
  ) as unknown as ScheduleNoLimitationsDtoUserBreathingExercisesItem[];
  const fetchedPhysicalExercises = transformExercises(
    scheduleData?.user_physical_exercises
  ) as unknown as ScheduleNoLimitationsDtoUserPhysicalExercisesItem[];

  const [isSummaryModalOpen, toggleSummaryModalVisibility] = useToggle();
  const [payload, setPayload] = useState<{
    userId: number;
    data: ScheduleNoLimitationsDto;
  }>();

  const isEditMode = Boolean(scheduleData);
  const {
    mutate: handleSetWithoutLimitationsCustomSchedule,
    isPending: isSetWithoutLimitationsCustomSchedulePending,
  } = useCaregiverControllerUpdateCustomScheduleNoLimitations({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetUserQueryKey(seniorId, {
              page: 1,
              pageSize: PaginationSize.Large,
            }),
          }),
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetUserScheduleQueryKey(seniorId),
          }),
        ]);

        notificationApi.success({
          message: t('admin_form_alert_saved'),
          description: t('admin_form_alert_successfully_saved_data'),
        });
        resetStore();
        toggleSummaryModalVisibility();
        navigate(redirectTo, { replace: true });
      },
      onError: (error: ErrorResponse) => {
        setBackendFieldErrors(error, setError);
      },
    },
  });

  const {
    handleSetWithoutLimitationActivities,
    breathingExercises,
    breathingExercisesLevel,
    physicalExercises,
    physicalExercisesLevel,
    walkingExercises,
    resetStore,
  } = useAssignActivitiesStore(state => ({
    handleSetWithoutLimitationActivities: state.handleSetWithoutLimitationActivities,
    breathingExercises: state.custom.formValues.withoutLimitation.breathingExercises,
    breathingExercisesLevel: state.custom.formValues.withoutLimitation.breathingExercisesLevel,
    physicalExercises: state.custom.formValues.withoutLimitation.physicalActivities,
    physicalExercisesLevel: state.custom.formValues.withoutLimitation.physicalActivitiesLevel,
    walkingExercises: state.custom.formValues.withoutLimitation.walkingTime,
    resetStore: state.resetStore,
  }));

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitSuccessful, isDirty },
  } = useForm<CustomScheduleWithoutLimitations>({
    resolver: zodResolver(customScheduleWithoutLimitationsSchema),
    defaultValues: {
      breathingExercises: isEditScheduleRoute ? fetchedBreathingExercises : breathingExercises,
      breathingExercisesLevel: isEditScheduleRoute
        ? (scheduleData?.breathing_level as unknown as ScheduleNoLimitationsDtoBreathingLevel)
        : breathingExercisesLevel,
      physicalExercises: isEditScheduleRoute ? fetchedPhysicalExercises : physicalExercises,
      physicalExercisesLevel: isEditScheduleRoute
        ? (scheduleData?.physical_level as unknown as ScheduleNoLimitationsDtoPhysicalLevel)
        : physicalExercisesLevel,
      personalGrowthChallenges:
        scheduleData && !!scheduleData.personal_growth
          ? (scheduleData.personal_growth as unknown as ScheduleNoLimitationsDtoPersonalGrowth)
          : PersonalGrowth.NotAssigned,
      walkingExercises: isEditScheduleRoute
        ? ([
            scheduleData?.user_walking_exercises?.walking_level,
          ] as unknown as ScheduleNoLimitationsDtoUserWalkingExercises[])
        : walkingExercises,
      cognitiveGames: [
        AddGameScoreDtoGameName.sudoku,
        AddGameScoreDtoGameName.game_2048,
        AddGameScoreDtoGameName.memory,
        AddGameScoreDtoGameName.snake,
        AddGameScoreDtoGameName.tic_tac_toe,
        AddGameScoreDtoGameName.word_guess,
        AddGameScoreDtoGameName.wordle,
      ],
    },
  });

  const handleBtnClick: SubmitHandler<CustomScheduleWithoutLimitations> = formValues => {
    if (isEditMode && !isDirty) {
      return navigate(redirectTo, { replace: true });
    }

    if (isEditMode) {
      setPayload({
        userId: seniorId,
        data: {
          breathing_level: formValues.breathingExercisesLevel,
          physical_level: formValues.physicalExercisesLevel,
          user_breathing_exercises: formValues.breathingExercises,
          user_physical_exercises: formValues.physicalExercises,
          user_walking_exercises: formValues.walkingExercises[0],
          personal_growth:
            formValues.personalGrowthChallenges === PersonalGrowth.NotAssigned
              ? undefined
              : formValues.personalGrowthChallenges,
        },
      });
    }

    handleSetWithoutLimitationActivities(formValues);
    toggleSummaryModalVisibility();
  };

  const handleSummaryConfirm = () => {
    if (!isEditMode) {
      toggleSummaryModalVisibility();
      onConfirmAddSchedule();

      return;
    }

    payload && handleSetWithoutLimitationsCustomSchedule(payload);
  };

  return (
    <div>
      <StyledCard
        title={t('admin_title_physical_exercises')}
        subtitle={t('admin_inf_physical_exercises')}
        titleContainerClassName={styles.title}
        className={styles.cardContainer}
      >
        <Form layout="vertical">
          <FormBuilder.CheckboxGroupItem
            label={t('admin_title_fall_prevention_and_balance_exercises_choose_3_to_4')}
            options={withoutLimitationsPhysicalExercises}
            control={control}
            name="physicalExercises"
          />
          <FormBuilder.RadioGroupItem
            label={t('admin_title_level')}
            options={withoutLimitationsPhysicalLevelOptions(recommendedLevel)}
            control={control}
            name="physicalExercisesLevel"
            className={styles.marginResetContainer}
          />
        </Form>
      </StyledCard>
      <StyledCard
        title={t('shared_title_walking')}
        subtitle={t('admin_inf_walking_exercise')}
        titleContainerClassName={styles.title}
        className={styles.cardContainer}
      >
        <Form layout="vertical">
          <FormBuilder.CheckboxGroupItem
            label={t('shared_title_walking')}
            options={walkingExercisesOptions(recommendedLevel)}
            control={control}
            name="walkingExercises"
            className={styles.marginResetContainer}
          />
        </Form>
      </StyledCard>
      <StyledCard
        title={t('shared_title_breathing_exercises')}
        subtitle={t('admin_inf_breathing_exercises')}
        titleContainerClassName={styles.title}
        className={styles.cardContainer}
      >
        <Form layout="vertical">
          <FormBuilder.CheckboxGroupItem
            label={t('admin_title_choose_up_to_two_exercises')}
            options={withoutLimitationsBreathingExercisesOptions}
            control={control}
            name="breathingExercises"
          />
          <FormBuilder.RadioGroupItem
            label={t('admin_title_level')}
            options={withoutLimitationsBreathingLevelOptions}
            control={control}
            name="breathingExercisesLevel"
          />
        </Form>
        <Alert
          banner
          message={
            <Trans>
              {t('admin_alert_recommended_level_for_exercises', {
                recommendedLevel: t('admin_title_light_activities'),
              })}
            </Trans>
          }
          type="info"
        />
      </StyledCard>
      {isEditScheduleRoute && (
        <StyledCard
          title={t('admin_title_personal_growth_challenges_optional')}
          subtitle={t('admin_inf_personal_growth_challenges_optional')}
          titleContainerClassName={styles.title}
          className={styles.cardContainer}
        >
          <Form layout="vertical">
            <FormBuilder.RadioGroupItem
              options={withoutLimitationsGrowthChallengesOptions}
              control={control}
              name="personalGrowthChallenges"
              className={styles.marginTopContainer}
            />
          </Form>
        </StyledCard>
      )}
      <StyledCard
        title={t('admin_title_cognitive_games')}
        subtitle={t('admin_inf_cognitive_games')}
        titleContainerClassName={styles.title}
        className={styles.cardContainer}
      >
        <div className={styles.marginTop}>
          <Trans>{t('admin_inf_cognitive_games_note')}</Trans>
        </div>
        <Form layout="vertical">
          <FormBuilder.CheckboxGroupItem
            options={cognitiveGamesOptions}
            control={control}
            name="cognitiveGames"
            className={styles.marginResetContainer}
          />
        </Form>
      </StyledCard>
      <FormControls
        onSubmit={handleSubmit(handleBtnClick)}
        confirmButtonText={t('shared_btn_save')}
        resetButtonText={t('shared_btn_cancel')}
        onReset={() => navigate(getSeniorCarePlanRedirectConfig(seniorId))}
        loading={isEditScheduleRoute && isSetWithoutLimitationsCustomSchedulePending}
      />
      <CustomScheduleDetailsModal
        isVisible={isSummaryModalOpen}
        toggleModal={toggleSummaryModalVisibility}
        limitationType={GenerateSchedulesDtoUserMobility.without_limitation_activities}
        onConfirm={handleSummaryConfirm}
        walkingTimeData={walkingTime}
        isLoading={isSetWithoutLimitationsCustomSchedulePending}
      />
      <NavigationBlockerModal
        shouldBlock={(!isSubmitSuccessful && !isEditMode) || (!isSubmitSuccessful && isDirty)}
      />
    </div>
  );
};

export default WithoutLimitationsCustomSchedule;
