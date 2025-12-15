import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import {
  useSeniorAssessmentStore,
  type AdditionalInfoData,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { additionalInfoSchema } from '@ProcarefulAdmin/utils';
import {
  getCaregiverControllerGetUserQueryKey,
  useCaregiverControllerAddAdditionalInfo,
  useCaregiverControllerAddUserAssessment,
} from '@Procareful/common/api';
import { SearchParams, useTypedTranslation, TimeFormat } from '@Procareful/common/lib';
import FormButtons from '../FormButtons';
import { useStyles } from './styles';

const AdditionalInfo = () => {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { styles } = useStyles();
  const stylish = useStylish();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const seniorId = searchParams.get(SearchParams.Id);

  const { formDetails, setSeniorAssessmentDetails } = useSeniorAssessmentStore(state => ({
    formDetails: state.formDetails,
    setSeniorAssessmentDetails: state.setSeniorAssessmentDetails,
  }));

  const {
    mutateAsync: addUserAssessment,
    isSuccess,
    isPending: isAddUserAssessmentPending,
  } = useCaregiverControllerAddUserAssessment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCaregiverControllerGetUserQueryKey(Number(seniorId), {
            page: 1,
            pageSize: PaginationSize.Large,
          }),
        });
      },
    },
  });

  const { mutateAsync: addAdditionalInfo, isPending: isAddAdditionalInfoPending } =
    useCaregiverControllerAddAdditionalInfo();

  const { control, handleSubmit } = useForm<AdditionalInfoData>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: formDetails,
  });

  const onSubmit: SubmitHandler<AdditionalInfoData> = async data => {
    setSeniorAssessmentDetails(data);
    const {
      mocaScoring,
      currentlyBedridden,
      canWalkWithoutSupport,
      severeBalanceProblems,
      vigorousActivityDaysLastWeek,
      vigorousActivityMinutesPerDayNotSure,
      moderateActivityMinutesPerDayNotSure,
      walkingMinutesPerDayNotSure,
      timeSittingLastWeekNotSure,
      vigorousActivityMinutesPerDay,
      moderateActivityDaysLastWeek,
      moderateActivityMinutesPerDay,
      walkingDaysLastWeek,
      walkingMinutesPerDay,
      timeSittingLastWeek,
      experienceOfEmptiness,
      missHavingPeopleAround,
      feelRejected,
      relyOnPeople,
      trustCompletely,
      enoughPeopleFeelClose,
      motivation,
      mobility,
      selfCare,
      usualActivities,
      painDiscomfort,
      anxietyDepression,
      generalHealth,
      bedTime,
      fallAsleepDuration,
      wakeUpTime,
      actualSleepHours,
      cannotSleepWithin30Minutes,
      wakeUpMidnightOrEarlyMorning,
      needToUseBathroom,
      cannotBreatheComfortably,
      feelTooCold,
      feelTooHot,
      hadBadDreams,
      havePain,
      coughOrSnoreLoudly,
      otherReasonsForTroubleSleeping,
      sleepingTroubleFrequency,
      medicineForSleep,
      sleepQualityRating,
      troubleStayingAwakeFrequency,
      enthusiasmToGetThingsDone,
      haveBedPartnerOrRoomMate,
      loudSnoring,
      breathingPause,
      legsTwitching,
      sleepDisorientation,
      coughOrSnoreLoudlyRoomMate,
      feelTooColdRoomMate,
      feelTooHotRoomMate,
      hadBadDreamsRoomMate,
      havePainRoomMate,
      otherRestlessness,
      otherRestlessnessFrequency,
    } = formDetails;

    const shouldSendAdditionalPhysicalData =
      !currentlyBedridden && canWalkWithoutSupport && !severeBalanceProblems;

    if (seniorId) {
      const addUserAssessmentResponse = await addUserAssessment({
        userId: Number(seniorId),
        data: {
          cognitive_abilities: {
            moca_scoring: mocaScoring!,
          },
          physical_activities: {
            currently_bedridden: currentlyBedridden!,
            can_walk_without_support: canWalkWithoutSupport!,
            severe_balance_problems: severeBalanceProblems!,
            ...(shouldSendAdditionalPhysicalData
              ? {
                  vigorous_activity_days_last_week: vigorousActivityDaysLastWeek,
                  vigorous_activity_minutes_per_day: vigorousActivityMinutesPerDayNotSure
                    ? null
                    : vigorousActivityMinutesPerDay,
                  moderate_activity_days_last_week: moderateActivityDaysLastWeek,
                  moderate_activity_minutes_per_day: moderateActivityMinutesPerDayNotSure
                    ? null
                    : moderateActivityMinutesPerDay,
                  walking_days_last_week: walkingDaysLastWeek,
                  walking_minutes_per_day: walkingMinutesPerDayNotSure
                    ? null
                    : walkingMinutesPerDay,
                  time_sitting_last_week: timeSittingLastWeekNotSure ? null : timeSittingLastWeek,
                }
              : {}),
          },
          social_abilities: {
            experience_of_emptiness: experienceOfEmptiness!,
            miss_having_people_around: missHavingPeopleAround!,
            feel_rejected: feelRejected!,
            rely_on_people: relyOnPeople!,
            trust_completely: trustCompletely!,
            enough_people_feel_close: enoughPeopleFeelClose!,
          },
          quality_of_life: {
            motivation: motivation!,
            mobility: mobility!,
            self_care: selfCare!,
            usual_activities: usualActivities!,
            pain_discomfort: painDiscomfort!,
            anxiety_depression: anxietyDepression!,
            general_health: generalHealth!,
          },
          sleep_assessment: {
            actual_sleep_hours: actualSleepHours!,
            bed_time: bedTime?.format(TimeFormat.HH_MM) || '',
            breathing_pause: breathingPause!,
            cannot_breathe_comfortably: cannotBreatheComfortably!,
            cannot_sleep_within_30_minutes: cannotSleepWithin30Minutes!,
            cough_or_snore_loudly: coughOrSnoreLoudly!,
            cough_or_snore_loudly_room_mate: coughOrSnoreLoudlyRoomMate,
            enthusiasm_to_get_things_done: enthusiasmToGetThingsDone!,
            fall_asleep_duration: fallAsleepDuration!,
            feel_too_cold: feelTooCold!,
            feel_too_cold_room_mate: feelTooColdRoomMate,
            feel_too_hot: feelTooHot!,
            feel_too_hot_room_mate: feelTooHotRoomMate,
            had_bad_dreams: hadBadDreams!,
            had_bad_dreams_room_mate: hadBadDreamsRoomMate,
            have_bed_partner_or_room_mate: haveBedPartnerOrRoomMate!,
            have_pain: havePain!,
            have_pain_room_mate: havePainRoomMate,
            legs_twitching: legsTwitching,
            loud_snoring: loudSnoring,
            medicine_for_sleep: medicineForSleep!,
            need_to_use_bathroom: needToUseBathroom!,
            other_reasons_for_trouble_sleeping: otherReasonsForTroubleSleeping,
            other_restlessness: otherRestlessness,
            sleep_disorientation: sleepDisorientation,
            sleep_quality_rating: sleepQualityRating!,
            sleeping_trouble_frequency: sleepingTroubleFrequency,
            trouble_staying_awake_frequency: troubleStayingAwakeFrequency!,
            trouble_sleeping_frequency_room_mate: otherRestlessnessFrequency!,
            wake_up_midnight_or_early_morning: wakeUpMidnightOrEarlyMorning!,
            wake_up_time: wakeUpTime?.format(TimeFormat.HH_MM) || '',
          },
        },
      });

      const { userAssessmentId } = addUserAssessmentResponse?.details || {};

      if (!userAssessmentId) {
        return;
      }

      const { notes } = data;

      if (!notes) {
        handleRedirectToDownloadReport(seniorId, userAssessmentId.toString());

        return;
      }

      addAdditionalInfo(
        {
          userId: Number(seniorId),
          assessmentId: userAssessmentId,
          data: {
            notes,
          },
        },
        {
          onSuccess: () => handleRedirectToDownloadReport(seniorId, userAssessmentId.toString()),
        }
      );
    }
  };

  const handleRedirectToDownloadReport = (seniorId: string, assessmentId: string) => {
    if (!assessmentId || !seniorId) {
      return;
    }

    navigate({
      pathname: PathRoutes.SeniorDownloadAssessmentReport,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorId,
        [SearchParams.AssessmentId]: assessmentId,
      }).toString(),
    });
  };

  return (
    <Form className={styles.container}>
      <StyledCard
        title={t('admin_title_additional_notes')}
        subtitle={t('admin_inf_additional_notes_subtitle')}
        className={stylish.cardContainer}
      >
        <FormItem name="notes" control={control}>
          <TextArea
            className={styles.textArea}
            placeholder={t('admin_form_sensitive_info_alert')}
            autoSize={{ minRows: 5 }}
            rows={5}
          />
        </FormItem>
      </StyledCard>
      <FormButtons
        containerClassName={styles.buttonContainer}
        onConfirm={handleSubmit(onSubmit)}
        confirmButtonText={t('shared_btn_save_and_finish')}
        loading={isAddUserAssessmentPending || isAddAdditionalInfoPending}
      />
      <NavigationBlockerModal shouldBlock={!isSuccess && !isAddUserAssessmentPending} />
    </Form>
  );
};

export default memo(AdditionalInfo);
