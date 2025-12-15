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
  bedriddenBreathingLevelOptions,
  bedriddenPhysicalLevelOptions,
  bedriddenBreathingExercisesOptions,
  cognitiveGamesOptions,
  exerciseInBed,
  PathRoutes,
  PersonalGrowth,
  bedriddenGrowthChallengesOptions,
  PaginationSize,
} from '@ProcarefulAdmin/constants';
import {
  useAssignActivitiesStore,
  type CustomScheduleBedridden,
} from '@ProcarefulAdmin/store/assignActivitiesStore';
import { customScheduleBedriddenSchema } from '@ProcarefulAdmin/utils';
import {
  AddGameScoreDtoGameName,
  useCaregiverControllerUpdateCustomScheduleBedridden,
  type GetUserScheduleDto,
  type ScheduleBedriddenDtoBreathingLevel,
  type ScheduleBedriddenDtoPersonalGrowth,
  type ScheduleBedriddenDtoPhysicalLevel,
  type ScheduleBedriddenDtoUserBreathingExercisesItem,
  type ScheduleBedriddenDtoUserPhysicalExercisesItem,
  type ErrorResponse,
  type GetWalkingTime,
  type ScheduleBedriddenDto,
  GenerateSchedulesDtoUserMobility,
  getCaregiverControllerGetUserQueryKey,
  getCaregiverControllerGetUserScheduleQueryKey,
} from '@Procareful/common/api';
import { useNotificationContext, useToggle, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { FormBuilder } from '@Procareful/ui';
import CustomScheduleDetailsModal from '../CustomScheduleDetailsModal';
import { getSeniorCarePlanRedirectConfig } from '../helpers';
import { useStyles } from '../styles';

type BedriddenCustomScheduleProps = {
  scheduleData?: GetUserScheduleDto;
  seniorId: number;
  redirectTo: To;
  walkingTime?: GetWalkingTime;
  onConfirmAddSchedule: () => void;
};

const BedriddenCustomSchedule = ({
  seniorId,
  scheduleData,
  redirectTo,
  walkingTime,
  onConfirmAddSchedule,
}: BedriddenCustomScheduleProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const isEditScheduleRoute = location.pathname === PathRoutes.SeniorEditProfileEditSchedule;
  const fetchedBreathingExercises = scheduleData?.user_breathing_exercises.map(
    exercise => exercise.name
  ) as unknown as ScheduleBedriddenDtoUserBreathingExercisesItem[];
  const fetchedPhysicalExercises = scheduleData?.user_physical_exercises.map(
    exercise => exercise.name
  ) as unknown as ScheduleBedriddenDtoUserPhysicalExercisesItem[];
  const [isSummaryModalOpen, toggleSummaryModalVisibility] = useToggle();
  const [payload, setPayload] = useState<{
    userId: number;
    data: ScheduleBedriddenDto;
  }>();

  const isEditMode = Boolean(scheduleData);

  const {
    mutate: handleSetBedriddenCustomSchedule,
    isPending: isSetBedriddenCustomSchedulePending,
  } = useCaregiverControllerUpdateCustomScheduleBedridden({
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
    handleSetBedriddenCustomActivities,
    breathingExercises,
    breathingExercisesLevel,
    physicalActivities,
    physicalExercisesLevel,
    resetStore,
  } = useAssignActivitiesStore(state => ({
    handleSetBedriddenCustomActivities: state.handleSetBedriddenCustomActivities,
    breathingExercises: state.custom.formValues.bedriddenLimitation.breathingExercises,
    breathingExercisesLevel: state.custom.formValues.bedriddenLimitation.breathingExercisesLevel,
    physicalActivities: state.custom.formValues.bedriddenLimitation.physicalActivities,
    physicalExercisesLevel: state.custom.formValues.bedriddenLimitation.physicalActivitiesLevel,
    resetStore: state.resetStore,
  }));

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitSuccessful, isDirty },
  } = useForm<CustomScheduleBedridden>({
    resolver: zodResolver(customScheduleBedriddenSchema),
    defaultValues: {
      breathingExercises: isEditScheduleRoute ? fetchedBreathingExercises : breathingExercises,
      breathingExercisesLevel: isEditScheduleRoute
        ? (scheduleData?.breathing_level as unknown as ScheduleBedriddenDtoBreathingLevel)
        : breathingExercisesLevel,
      physicalExercisesInBed: isEditScheduleRoute ? fetchedPhysicalExercises : physicalActivities,
      physicalExercisesLevel: isEditScheduleRoute
        ? (scheduleData?.physical_level as unknown as ScheduleBedriddenDtoPhysicalLevel)
        : physicalExercisesLevel,
      personalGrowthChallenges:
        scheduleData && !!scheduleData.personal_growth
          ? (scheduleData.personal_growth as unknown as ScheduleBedriddenDtoPersonalGrowth)
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

  const handleFormSubmit: SubmitHandler<CustomScheduleBedridden> = formValues => {
    if (isEditMode && !isDirty) {
      return navigate(redirectTo, { replace: true });
    }

    if (scheduleData) {
      setPayload({
        userId: seniorId,
        data: {
          breathing_level: formValues.breathingExercisesLevel,
          user_breathing_exercises: formValues.breathingExercises,
          physical_level: formValues.physicalExercisesLevel,
          user_physical_exercises: formValues.physicalExercisesInBed,
          personal_growth:
            formValues.personalGrowthChallenges === PersonalGrowth.NotAssigned
              ? undefined
              : formValues.personalGrowthChallenges,
        },
      });
    }

    toggleSummaryModalVisibility();
    handleSetBedriddenCustomActivities(formValues);
  };

  const handleSummaryConfirm = () => {
    if (!isEditMode) {
      toggleSummaryModalVisibility();
      onConfirmAddSchedule();

      return;
    }

    payload && handleSetBedriddenCustomSchedule(payload);
  };

  return (
    <div>
      <StyledCard
        title={t('admin_title_physical_exercises')}
        subtitle={t('admin_inf_physical_exercises')}
        titleContainerClassName={styles.title}
        className={styles.cardContainer}
      >
        <Form onFinish={handleSubmit(handleFormSubmit)} layout="vertical">
          <FormBuilder.CheckboxGroupItem
            label={t('admin_title_exercises_in_bed_choose_3_to_5')}
            options={exerciseInBed}
            control={control}
            name="physicalExercisesInBed"
          />
          <FormBuilder.RadioGroupItem
            label={t('admin_title_level')}
            options={bedriddenPhysicalLevelOptions}
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
        <Form onFinish={handleSubmit(handleFormSubmit)} layout="vertical">
          <FormBuilder.CheckboxGroupItem
            label={t('admin_title_choose_up_to_two_exercises')}
            options={bedriddenBreathingExercisesOptions}
            control={control}
            name="breathingExercises"
          />
          <FormBuilder.RadioGroupItem
            label={t('admin_title_level')}
            options={bedriddenBreathingLevelOptions}
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
              options={bedriddenGrowthChallengesOptions}
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
          />
        </Form>
      </StyledCard>
      <FormControls
        onSubmit={handleSubmit(handleFormSubmit)}
        confirmButtonText={t('shared_btn_save')}
        resetButtonText={t('shared_btn_cancel')}
        onReset={() => navigate(getSeniorCarePlanRedirectConfig(seniorId))}
        loading={isEditScheduleRoute && isSetBedriddenCustomSchedulePending}
      />
      <CustomScheduleDetailsModal
        isVisible={isSummaryModalOpen}
        toggleModal={toggleSummaryModalVisibility}
        limitationType={GenerateSchedulesDtoUserMobility.bedridden_activities}
        onConfirm={handleSummaryConfirm}
        walkingTimeData={walkingTime}
        isLoading={isSetBedriddenCustomSchedulePending}
      />
      <NavigationBlockerModal
        shouldBlock={(!isSubmitSuccessful && !isEditMode) || (!isSubmitSuccessful && isDirty)}
      />
    </div>
  );
};

export default BedriddenCustomSchedule;
