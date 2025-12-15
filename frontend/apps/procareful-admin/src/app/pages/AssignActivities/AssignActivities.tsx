import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import { PathRoutes, activitiesLevel } from '@ProcarefulAdmin/constants';
import { useAssignActivitiesStore } from '@ProcarefulAdmin/store/assignActivitiesStore';
import {
  type ScheduleBedriddenDtoPersonalGrowth,
  type ScheduleMobilityLimitationsDtoPersonalGrowth,
  type GetUserMobilityLevelResponseDto,
  type ScheduleNoLimitationsDtoPersonalGrowth,
  GetUserMobilityLevelMobilityLevel,
  useCaregiverControllerGenerateSchedules,
  useCaregiverControllerSaveSchedule,
  getCaregiverControllerGetUserAssessmentScoresMobilityLevelQueryKey,
  useCaregiverControllerUpdateCustomScheduleBedridden,
  useCaregiverControllerUpdateCustomScheduleMobilityLimitations,
  useCaregiverControllerUpdateCustomScheduleNoLimitations,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Spinner, Text, Title } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ActivityTile from './ActivityTile';
import ScheduleDetailsModal from './ScheduleDetailsModal';
import {
  activityTileData,
  assignActivitiesDescription,
  assignActivitiesTitle,
  challengeTileData,
  challengeTileDescription,
  challengeTileTitle,
  personalGrowthValues,
} from './constants';
import { useStyles } from './styles';
import { AssignActivitiesParams } from './types';

const AssignActivities = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { notificationApi } = useNotificationContext();
  const isModalOpen = searchParams.has(SearchParams.Preview);
  const hasStepParams = searchParams.has(SearchParams.Step);
  const seniorId = Number(searchParams.get(SearchParams.Id));
  const stepSearchParamsValue = searchParams.get(SearchParams.Step) as AssignActivitiesParams;
  const isPickChallengeStep = stepSearchParamsValue === AssignActivitiesParams.Challenge;
  const isSummaryStep = stepSearchParamsValue === AssignActivitiesParams.Summary;
  const hasNavigatedRef = useRef(false);

  const customScheduleRedirectConfig = {
    pathname: PathRoutes.SeniorBuildCustomSchedule,
    search: new URLSearchParams({
      [SearchParams.Id]: seniorId.toString(),
    }).toString(),
  };

  const seniorDetailsRedirectConfig = useMemo(
    () => ({
      pathname: PathRoutes.SeniorProfile,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorId.toString(),
      }).toString(),
    }),
    [seniorId]
  );

  const handleRedirectionToSeniorDetails = (type: 'success' | 'error') => () => {
    navigate(seniorDetailsRedirectConfig, { replace: true });
    resetStore();

    if (type === 'error') {
      notificationApi.error({
        message: t('admin_title_alert_error'),
        description: t('admin_inf_alert_title'),
      });
    }

    if (type === 'success') {
      notificationApi.success({
        message: t('admin_form_alert_saved'),
        description: t('admin_form_alert_successfully_saved_data'),
      });
    }
  };

  const {
    custom,
    selectedActivity,
    selectedChallenge,
    mobilityLimitationsPhysicalExercises,
    mobilityLimitationsPhysicalExercisesLevel,
    mobilityLimitationsBreathingExercises,
    mobilityLimitationsBreathingExercisesLevel,
    bedriddenPhysicalExercises,
    bedriddenPhysicalExercisesLevel,
    bedriddenBreathingExercises,
    bedriddenLimitationsBreathingExercisesLevel,
    withoutLimitationsPhysicalExercises,
    withoutLimitationsPhysicalExercisesLevel,
    withoutLimitationsBreathingExercises,
    withoutLimitationsBreathingExercisesLevel,
    withoutLimitationsWalkingExercises,
    resetStore,
  } = useAssignActivitiesStore(state => ({
    custom: state.custom,
    assignActivitiesStore: {
      light: state.light,
      moderate: state.moderate,
      intense: state.intense,
      custom: state.custom,
      youths: state.youths,
      peer: state.peer,
    },
    resetStore: state.resetStore,
    selectedActivity: state.selectedActivity,
    selectedChallenge: state.selectedChallenge,
    mobilityLimitationsPhysicalExercises:
      state.custom.formValues.mobilityLimitation.physicalActivities,
    mobilityLimitationsPhysicalExercisesLevel:
      state.custom.formValues.mobilityLimitation.physicalActivitiesLevel,
    mobilityLimitationsBreathingExercises:
      state.custom.formValues.mobilityLimitation.breathingExercises,
    mobilityLimitationsBreathingExercisesLevel:
      state.custom.formValues.mobilityLimitation.breathingExercisesLevel,
    bedriddenPhysicalExercises: state.custom.formValues.bedriddenLimitation.physicalActivities,
    bedriddenPhysicalExercisesLevel:
      state.custom.formValues.bedriddenLimitation.physicalActivitiesLevel,
    bedriddenBreathingExercises: state.custom.formValues.bedriddenLimitation.breathingExercises,
    bedriddenLimitationsBreathingExercisesLevel:
      state.custom.formValues.bedriddenLimitation.breathingExercisesLevel,
    withoutLimitationsPhysicalExercises:
      state.custom.formValues.withoutLimitation.physicalActivities,
    withoutLimitationsPhysicalExercisesLevel:
      state.custom.formValues.withoutLimitation.physicalActivitiesLevel,
    withoutLimitationsBreathingExercises:
      state.custom.formValues.withoutLimitation.breathingExercises,
    withoutLimitationsBreathingExercisesLevel:
      state.custom.formValues.withoutLimitation.breathingExercisesLevel,
    withoutLimitationsWalkingExercises: state.custom.formValues.withoutLimitation.walkingTime,
  }));

  const { data: generatedSchedules, isLoading } = useCaregiverControllerGenerateSchedules(seniorId);

  const {
    mutate: handleSetSchedule,
    isPending,
    isError: isSetScheduleError,
  } = useCaregiverControllerSaveSchedule({
    mutation: {
      onSuccess: handleRedirectionToSeniorDetails('success'),
      onError: handleRedirectionToSeniorDetails('error'),
    },
    request: { data: generatedSchedules },
  });

  const {
    mutate: handleSetBedriddenCustomSchedule,
    isPending: isSetBedriddenCustomSchedulePending,
    isError: isSetBedriddenCustomScheduleError,
  } = useCaregiverControllerUpdateCustomScheduleBedridden({
    mutation: {
      onSuccess: handleRedirectionToSeniorDetails('success'),
      onError: handleRedirectionToSeniorDetails('error'),
    },
  });
  const {
    mutate: handleSetWithLimitationsCustomSchedule,
    isPending: isSetWithLimitationsCustomSchedulePending,
    isError: isSetWithLimitationsCustomScheduleError,
  } = useCaregiverControllerUpdateCustomScheduleMobilityLimitations({
    mutation: {
      onSuccess: handleRedirectionToSeniorDetails('success'),
      onError: handleRedirectionToSeniorDetails('error'),
    },
  });

  const {
    mutate: handleSetWithoutLimitationsCustomSchedule,
    isPending: isSetWithoutLimitationsCustomSchedulePending,
    isError: isSetWithoutLimitationsCustomScheduleError,
  } = useCaregiverControllerUpdateCustomScheduleNoLimitations({
    mutation: {
      onSuccess: handleRedirectionToSeniorDetails('success'),
      onError: handleRedirectionToSeniorDetails('error'),
    },
  });

  const { recommendedLevel, userMobility: limitationType } = generatedSchedules?.details || {};

  useEffect(() => {
    if (
      (!seniorId && !hasNavigatedRef.current) ||
      (isSummaryStep &&
        !selectedActivity &&
        !selectedChallenge &&
        (isSetScheduleError ||
          isSetBedriddenCustomScheduleError ||
          isSetWithLimitationsCustomScheduleError ||
          isSetWithoutLimitationsCustomScheduleError))
    ) {
      hasNavigatedRef.current = true; // Mark as navigated to prevent re-triggering

      navigate(!seniorId ? PathRoutes.Seniors : seniorDetailsRedirectConfig, { replace: true });

      notificationApi.error({
        message: t('admin_title_alert_error'),
        description: t('admin_inf_alert_title'),
      });
    }

    if (seniorId || (!isSummaryStep && selectedActivity && selectedChallenge)) {
      hasNavigatedRef.current = false; // Reset the flag when seniorId is present
    }
  }, [
    seniorId,
    navigate,
    notificationApi,
    t,
    isSummaryStep,
    selectedActivity,
    selectedChallenge,
    seniorDetailsRedirectConfig,
    isSetScheduleError,
    isSetBedriddenCustomScheduleError,
    isSetWithLimitationsCustomScheduleError,
    isSetWithoutLimitationsCustomScheduleError,
  ]);

  const stepTitle = hasStepParams
    ? assignActivitiesTitle[stepSearchParamsValue]
    : t('admin_title_recommended_schedules_for_your_senior');

  const stepDescription = hasStepParams
    ? assignActivitiesDescription[stepSearchParamsValue]
    : t('admin_inf_recommended_schedules_for_your_senior');

  const personalChallengesButtonText = !selectedChallenge
    ? t('admin_btn_skip')
    : t('shared_btn_save');

  const confirmButtonOnParamsText = {
    [AssignActivitiesParams.Challenge]: personalChallengesButtonText,
    [AssignActivitiesParams.Summary]: t('admin_btn_assign_and_finish'),
  };

  const handleCloseModal = () => {
    searchParams.delete(SearchParams.Preview);
    const newSearchParams = new URLSearchParams(searchParams);
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleEditCustomSchedule = () => {
    navigate(customScheduleRedirectConfig);
  };

  const handleCancelAssigningActivity = () => {
    navigate(seniorDetailsRedirectConfig, { replace: true });
  };

  const handleSaveButtonClick = () => {
    if (selectedActivity && isSummaryStep && selectedActivity !== 'custom' && seniorId) {
      handleSetSchedule({
        activityLevel: selectedActivity,
        userId: seniorId,
        params: {
          personalGrowth: selectedChallenge && personalGrowthValues[selectedChallenge],
        },
      });

      return;
    }

    const seniorLimitationData: GetUserMobilityLevelResponseDto | undefined =
      queryClient.getQueryData(
        getCaregiverControllerGetUserAssessmentScoresMobilityLevelQueryKey(seniorId)
      );

    if (
      seniorLimitationData &&
      selectedActivity &&
      isSummaryStep &&
      selectedActivity === 'custom' &&
      seniorId
    ) {
      const limitationType = seniorLimitationData.details.mobility_level;

      if (
        limitationType === GetUserMobilityLevelMobilityLevel.bedridden_activities &&
        bedriddenBreathingExercises &&
        bedriddenLimitationsBreathingExercisesLevel &&
        bedriddenPhysicalExercises &&
        bedriddenPhysicalExercisesLevel
      ) {
        handleSetBedriddenCustomSchedule({
          data: {
            user_breathing_exercises: bedriddenBreathingExercises,
            breathing_level: bedriddenLimitationsBreathingExercisesLevel,
            user_physical_exercises: bedriddenPhysicalExercises,
            physical_level: bedriddenPhysicalExercisesLevel,
            personal_growth:
              selectedChallenge &&
              (personalGrowthValues[
                selectedChallenge
              ] as unknown as ScheduleBedriddenDtoPersonalGrowth),
          },
          userId: seniorId,
        });
      }

      if (
        limitationType === GetUserMobilityLevelMobilityLevel.mobility_limitation_activities &&
        mobilityLimitationsBreathingExercises &&
        mobilityLimitationsBreathingExercisesLevel &&
        mobilityLimitationsPhysicalExercises &&
        mobilityLimitationsPhysicalExercisesLevel
      ) {
        handleSetWithLimitationsCustomSchedule({
          data: {
            user_breathing_exercises: mobilityLimitationsBreathingExercises,
            breathing_level: mobilityLimitationsBreathingExercisesLevel,
            user_physical_exercises: mobilityLimitationsPhysicalExercises,
            physical_level: mobilityLimitationsPhysicalExercisesLevel,
            personal_growth:
              selectedChallenge &&
              (personalGrowthValues[
                selectedChallenge
              ] as unknown as ScheduleMobilityLimitationsDtoPersonalGrowth),
          },
          userId: seniorId,
        });
      }

      if (
        limitationType === GetUserMobilityLevelMobilityLevel.without_limitation_activities &&
        withoutLimitationsBreathingExercises &&
        withoutLimitationsBreathingExercisesLevel &&
        withoutLimitationsPhysicalExercises &&
        withoutLimitationsPhysicalExercisesLevel &&
        withoutLimitationsWalkingExercises
      ) {
        handleSetWithoutLimitationsCustomSchedule({
          data: {
            user_breathing_exercises: withoutLimitationsBreathingExercises,
            breathing_level: withoutLimitationsBreathingExercisesLevel,
            user_physical_exercises: withoutLimitationsPhysicalExercises,
            physical_level: withoutLimitationsPhysicalExercisesLevel,
            user_walking_exercises: withoutLimitationsWalkingExercises[0],
            personal_growth:
              selectedChallenge &&
              (personalGrowthValues[
                selectedChallenge
              ] as unknown as ScheduleNoLimitationsDtoPersonalGrowth),
          },
          userId: seniorId,
        });
      }

      return;
    }

    const searchParamsToDelete = hasStepParams ? SearchParams.Step : SearchParams.Preview;
    const searchParamsToSet = hasStepParams
      ? AssignActivitiesParams.Summary
      : AssignActivitiesParams.Challenge;
    searchParams.delete(searchParamsToDelete);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(SearchParams.Step, searchParamsToSet);
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleGoBack = () => {
    searchParams.delete(SearchParams.Step);
    const previousSearchParams = new URLSearchParams(searchParams);
    previousSearchParams.set(SearchParams.Step, AssignActivitiesParams.Challenge);
    const nextSearchParams = new URLSearchParams(searchParams);
    setSearchParams(isSummaryStep ? previousSearchParams : nextSearchParams, { replace: true });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.headerContainer}>
          <Title level={4}>{stepTitle}</Title>
          {!hasStepParams && (
            <Link to={customScheduleRedirectConfig}>
              <Button className={styles.button} icon={<EditOutlinedIcon />}>
                {t('admin_btn_build_your_own_schedule')}
              </Button>
            </Link>
          )}
        </div>
        <div className={styles.descriptionContainer}>
          <Text>{stepDescription}</Text>
        </div>
        <div className={styles.activityContainer}>
          {hasStepParams &&
            isPickChallengeStep &&
            challengeTileData.map((tile, index) => (
              <ActivityTile key={index} limitationType={limitationType} {...tile} />
            ))}
          {!hasStepParams &&
            activityTileData.map((tile, index) => (
              <ActivityTile
                key={index}
                limitationType={limitationType}
                recommendedType={recommendedLevel}
                {...tile}
              />
            ))}
          {hasStepParams && isSummaryStep && selectedActivity && (
            <>
              <ActivityTile
                limitationType={limitationType}
                activityType={selectedActivity}
                title={
                  selectedActivity === 'custom'
                    ? t('admin_title_custom_schedule')
                    : activitiesLevel[selectedActivity]
                }
              />
              {selectedChallenge && (
                <ActivityTile
                  limitationType={limitationType}
                  activityType={selectedChallenge}
                  title={challengeTileTitle[selectedChallenge]}
                  description={challengeTileDescription[selectedChallenge]}
                />
              )}
            </>
          )}
        </div>
        {custom.isVisible && !hasStepParams && (
          <div className={styles.activityContainer}>
            <ActivityTile
              title={t('admin_title_custom_schedule')}
              activityType="custom"
              onLinkButtonClick={handleEditCustomSchedule}
            />
          </div>
        )}
      </div>
      <FormControls
        resetButtonText={t('shared_btn_cancel')}
        confirmButtonText={
          stepSearchParamsValue
            ? confirmButtonOnParamsText[stepSearchParamsValue]
            : t('shared_btn_save')
        }
        onGoBack={hasStepParams ? handleGoBack : undefined}
        onReset={handleCancelAssigningActivity}
        onSubmit={handleSaveButtonClick}
        containerClassName={cx({ [styles.formButtonContainer]: hasStepParams })}
        buttonClassName={styles.formButton}
        isConfirmDisabled={!selectedActivity && !hasStepParams}
        loading={
          isPending ||
          isSetBedriddenCustomSchedulePending ||
          isSetWithLimitationsCustomSchedulePending ||
          isSetWithoutLimitationsCustomSchedulePending
        }
      />
      <ScheduleDetailsModal
        isVisible={isModalOpen}
        toggleModal={handleCloseModal}
        limitationType={limitationType}
        activitiesScheduleData={generatedSchedules?.details}
      />
    </div>
  );
};

export default AssignActivities;
