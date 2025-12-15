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
  balanceAndCoordinationExercises,
  withoutLimitationsBreathingExercisesOptions,
  cognitiveGamesOptions,
  limitationsBreathingLevelOptions,
  limitationsPhysicalLevelOptions,
  lowerBodyExercises,
  upperBodyExercises,
  PathRoutes,
  mobilityLimitationsGrowthChallengesOptions,
  PersonalGrowth,
  PaginationSize,
} from '@ProcarefulAdmin/constants';
import {
  useAssignActivitiesStore,
  type CustomScheduleWithLimitations,
} from '@ProcarefulAdmin/store/assignActivitiesStore';
import { customScheduleWithLimitationsSchema } from '@ProcarefulAdmin/utils';
import {
  AddGameScoreDtoGameName,
  useCaregiverControllerUpdateCustomScheduleMobilityLimitations,
  type GetUserScheduleDto,
  type ScheduleMobilityLimitationsDtoBreathingLevel,
  type ScheduleMobilityLimitationsDtoPersonalGrowth,
  type ScheduleMobilityLimitationsDtoPhysicalLevel,
  type ScheduleMobilityLimitationsDtoUserBreathingExercisesItem,
  type ErrorResponse,
  GenerateSchedulesDtoUserMobility,
  type GetWalkingTime,
  type ScheduleMobilityLimitationsDto,
  getCaregiverControllerGetUserQueryKey,
  getCaregiverControllerGetUserScheduleQueryKey,
} from '@Procareful/common/api';
import { useNotificationContext, useToggle, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { FormBuilder } from '@Procareful/ui';
import CustomScheduleDetailsModal from '../CustomScheduleDetailsModal';
import { getSeniorCarePlanRedirectConfig, splittedMobilityLimitationExercises } from '../helpers';
import { useStyles } from '../styles';

type PhysicalLimitationsCustomScheduleProps = {
  scheduleData?: GetUserScheduleDto;
  seniorId: number;
  redirectTo: To;
  walkingTime?: GetWalkingTime;
  onConfirmAddSchedule: () => void;
};

const PhysicalLimitationsCustomSchedule = ({
  scheduleData,
  seniorId,
  redirectTo,
  walkingTime,
  onConfirmAddSchedule,
}: PhysicalLimitationsCustomScheduleProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const [isSummaryModalOpen, toggleSummaryModalVisibility] = useToggle();
  const [payload, setPayload] = useState<{
    userId: number;
    data: ScheduleMobilityLimitationsDto;
  }>();

  const isEditMode = Boolean(scheduleData);

  const isEditScheduleRoute = location.pathname === PathRoutes.SeniorEditProfileEditSchedule;
  const fetchedBreathingExercises = scheduleData?.user_breathing_exercises.map(
    exercise => exercise.name
  ) as unknown as ScheduleMobilityLimitationsDtoUserBreathingExercisesItem[];
  const {
    fetchedLowerBodyExercises,
    fetchedUpperBodyExercises,
    fetchedBalanceAndCoordinationExercises,
  } = splittedMobilityLimitationExercises(scheduleData?.user_physical_exercises);

  const {
    mutate: handleSetMobilityLimitationsCustomSchedule,
    isPending: isSetMobilityLimitationsCustomSchedulePending,
  } = useCaregiverControllerUpdateCustomScheduleMobilityLimitations({
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
    handleSetMobilityLimitationCustomActivities,
    breathingExercises,
    breathingExercisesLevel,
    physicalExercisesLowerBody,
    physicalExercisesUpperBody,
    physicalExercisesBalanceAndCoordination,
    physicalExercisesLevel,
    resetStore,
  } = useAssignActivitiesStore(state => ({
    handleSetMobilityLimitationCustomActivities: state.handleSetMobilityLimitationCustomActivities,
    breathingExercises: state.custom.formValues.mobilityLimitation.breathingExercises,
    breathingExercisesLevel: state.custom.formValues.mobilityLimitation.breathingExercisesLevel,
    physicalExercisesLowerBody:
      state.custom.formValues.mobilityLimitation.physicalExercisesLowerBody,
    physicalExercisesUpperBody:
      state.custom.formValues.mobilityLimitation.physicalExercisesUpperBody,
    physicalExercisesBalanceAndCoordination:
      state.custom.formValues.mobilityLimitation.physicalExercisesBalanceAndCoordination,
    physicalExercisesLevel: state.custom.formValues.mobilityLimitation.physicalActivitiesLevel,
    resetStore: state.resetStore,
  }));

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitSuccessful, isDirty },
  } = useForm<CustomScheduleWithLimitations>({
    resolver: zodResolver(customScheduleWithLimitationsSchema),
    defaultValues: {
      breathingExercises: isEditScheduleRoute ? fetchedBreathingExercises : breathingExercises,
      breathingExercisesLevel: isEditScheduleRoute
        ? (scheduleData?.breathing_level as unknown as ScheduleMobilityLimitationsDtoBreathingLevel)
        : breathingExercisesLevel,
      physicalExercisesLowerBody: isEditScheduleRoute
        ? fetchedLowerBodyExercises
        : physicalExercisesLowerBody,
      physicalExercisesUpperBody: isEditScheduleRoute
        ? fetchedUpperBodyExercises
        : physicalExercisesUpperBody,
      physicalExercisesBalanceAndCoordination: isEditScheduleRoute
        ? fetchedBalanceAndCoordinationExercises
        : physicalExercisesBalanceAndCoordination,
      physicalExercisesLevel: isEditScheduleRoute
        ? (scheduleData?.physical_level as unknown as ScheduleMobilityLimitationsDtoPhysicalLevel)
        : physicalExercisesLevel,
      personalGrowthChallenges:
        scheduleData && !!scheduleData.personal_growth
          ? (scheduleData.personal_growth as unknown as ScheduleMobilityLimitationsDtoPersonalGrowth)
          : PersonalGrowth.NotAssigned,
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

  const handleFormSubmit: SubmitHandler<CustomScheduleWithLimitations> = formValues => {
    if (isEditMode && !isDirty) {
      return navigate(redirectTo, { replace: true });
    }

    if (isEditMode) {
      setPayload({
        userId: seniorId,
        data: {
          breathing_level: formValues.breathingExercisesLevel,
          user_breathing_exercises: formValues.breathingExercises,
          physical_level: formValues.physicalExercisesLevel,
          user_physical_exercises: [
            ...formValues.physicalExercisesLowerBody,
            ...formValues.physicalExercisesUpperBody,
            ...formValues.physicalExercisesBalanceAndCoordination,
          ],
          personal_growth:
            formValues.personalGrowthChallenges === PersonalGrowth.NotAssigned
              ? undefined
              : formValues.personalGrowthChallenges,
        },
      });
    }

    handleSetMobilityLimitationCustomActivities(formValues);
    toggleSummaryModalVisibility();
  };

  const handleSummaryConfirm = () => {
    if (!isEditMode) {
      toggleSummaryModalVisibility();
      onConfirmAddSchedule();

      return;
    }

    payload && handleSetMobilityLimitationsCustomSchedule(payload);
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
            label={t('admin_title_lower_body_exercises_choose_1_to_2')}
            options={lowerBodyExercises}
            control={control}
            name="physicalExercisesLowerBody"
          />
          <FormBuilder.CheckboxGroupItem
            label={t('admin_title_upper_body_exercises_choose_1_to_2')}
            options={upperBodyExercises}
            control={control}
            name="physicalExercisesUpperBody"
          />
          <FormBuilder.CheckboxGroupItem
            label={t('admin_title_balance_and_coordination_choose_1_to_2')}
            options={balanceAndCoordinationExercises}
            control={control}
            name="physicalExercisesBalanceAndCoordination"
          />
          <FormBuilder.RadioGroupItem
            label={t('admin_title_level')}
            options={limitationsPhysicalLevelOptions}
            control={control}
            name="physicalExercisesLevel"
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
            options={limitationsBreathingLevelOptions}
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
              options={mobilityLimitationsGrowthChallengesOptions}
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
        onSubmit={handleSubmit(handleFormSubmit)}
        confirmButtonText={t('shared_btn_save')}
        resetButtonText={t('shared_btn_cancel')}
        onReset={() => navigate(getSeniorCarePlanRedirectConfig(seniorId))}
        loading={isEditScheduleRoute && isSetMobilityLimitationsCustomSchedulePending}
      />
      <NavigationBlockerModal
        shouldBlock={(!isSubmitSuccessful && !isEditMode) || (!isSubmitSuccessful && isDirty)}
      />
      <CustomScheduleDetailsModal
        isVisible={isSummaryModalOpen}
        toggleModal={toggleSummaryModalVisibility}
        limitationType={GenerateSchedulesDtoUserMobility.mobility_limitation_activities}
        onConfirm={handleSummaryConfirm}
        walkingTimeData={walkingTime}
        isLoading={isSetMobilityLimitationsCustomSchedulePending}
      />
    </div>
  );
};

export default PhysicalLimitationsCustomSchedule;
