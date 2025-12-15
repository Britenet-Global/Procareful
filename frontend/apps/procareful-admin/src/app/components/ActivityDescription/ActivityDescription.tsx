import { activitiesModalConfig, lowerRepetitionExercises } from '@ProcarefulAdmin/constants';
import {
  activityTitle,
  breathingExercisesName,
  physicalExercisesName,
  withoutLimitationsPhysicalExercisesName,
} from '@ProcarefulAdmin/pages/AssignActivities/constants';
import type { ActivityDescriptionType } from '@ProcarefulAdmin/typings';
import {
  GenerateSchedulesDtoUserMobility,
  type GetWalkingTime,
  type GenerateSchedulesDtoRecommendedLevel,
  type GeneratedSingleScheduleDto,
  type ScheduleNoLimitationsDtoUserWalkingExercises,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Tag, Text, Title } from '@Procareful/ui';
import ActivityIcon from '../ActivityIcon';
import { useStyles } from './styles';

type ActivityDescriptionProps = {
  activityType: Exclude<ActivityDescriptionType, 'personalGrowth'>;
  activityData: GeneratedSingleScheduleDto;
  activityLevel: GenerateSchedulesDtoRecommendedLevel;
  limitationType: GenerateSchedulesDtoUserMobility;
  isCustomSchedule?: boolean;
  walkingTimeData?: GetWalkingTime;
};

const ActivityDescription = ({
  activityType,
  activityData,
  activityLevel,
  limitationType,
  isCustomSchedule = false,
  walkingTimeData,
}: ActivityDescriptionProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const isPhysicalType = activityType === 'physicalActivities';
  const isWalkingType = activityType === 'walking';
  const isBreathingType = activityType === 'breathingExercises';
  const isCognitiveType = activityType === 'cognitiveGames';
  const isBedriddenType = limitationType === GenerateSchedulesDtoUserMobility.bedridden_activities;
  const isWithoutLimitationType =
    limitationType === GenerateSchedulesDtoUserMobility.without_limitation_activities;

  const isLowerRepetitionInPhysicalType = activityData.physicalActivities.some(exercise =>
    lowerRepetitionExercises.includes(exercise)
  );

  const { cognitiveGames, breathingExercises, physicalActivities } =
    activitiesModalConfig[limitationType][activityLevel];

  const handleRenderActivityDuration = (repetitionType?: 'more' | 'less') => {
    const physicalActivityRepetitionFrequency = physicalActivities.frequencyRepetition;
    const isPhysicalRepetitionFrequencyNumberType =
      typeof physicalActivityRepetitionFrequency === 'number';

    if (isWalkingType || (isCustomSchedule && walkingTimeData)) {
      const walkingTimeToDisplay =
        isCustomSchedule && walkingTimeData
          ? walkingTimeData[
              activityData.walkingTime as unknown as ScheduleNoLimitationsDtoUserWalkingExercises
            ].toString()
          : activityData.walkingTime.toString();

      const formattedWalkingTime =
        walkingTimeToDisplay === 'same_as_now' ? t('admin_inf_same_as_now') : walkingTimeToDisplay;

      return t('admin_inf_time_minutes_per_day', { count: formattedWalkingTime });
    }

    if (isPhysicalType && isBedriddenType) {
      return t('admin_inf_time_per_day_and_repetition', {
        frequencyPerDay: physicalActivities.frequencyPerDay.toString(),
        frequencyRepetition: physicalActivities.frequencyRepetition.toString(),
      });
    }

    if (isPhysicalType && !isBedriddenType && isPhysicalRepetitionFrequencyNumberType) {
      return t('admin_inf_time_per_week_and_repetition', {
        frequencyPerWeek: physicalActivities.frequencyPerWeek.toString(),
        frequencyRepetition: physicalActivityRepetitionFrequency.toString(),
      });
    }

    if (isPhysicalType && !isBedriddenType && !isPhysicalRepetitionFrequencyNumberType) {
      const frequencyRepetition =
        repetitionType === 'less'
          ? physicalActivityRepetitionFrequency[0]
          : physicalActivityRepetitionFrequency[1];

      return t('admin_inf_time_per_week_and_repetition', {
        frequencyPerWeek: physicalActivities.frequencyPerWeek.toString(),
        frequencyRepetition: frequencyRepetition.toString(),
      });
    }

    if (isBreathingType && !isBedriddenType) {
      return t('admin_inf_time_per_week_and_repetition', {
        frequencyPerWeek: breathingExercises.frequencyPerWeek.toString(),
        frequencyRepetition: breathingExercises.frequencyRepetition.toString(),
      });
    }

    if (isBreathingType && isBedriddenType) {
      return t('admin_inf_time_per_day_and_repetition', {
        frequencyPerDay: breathingExercises.frequencyPerDay.toString(),
        frequencyRepetition: breathingExercises.frequencyRepetition.toString(),
      });
    }

    if (isCognitiveType) {
      return t('admin_inf_time_per_day_and_week', {
        frequencyPerDay: cognitiveGames.frequencyPerDay.toString(),
        frequencyPerWeek: cognitiveGames.frequencyPerWeek.toString(),
      });
    }
  };

  const handleRenderActivityDescriptionAndLabel = () => {
    if (isPhysicalType && isLowerRepetitionInPhysicalType) {
      const exercisesWithLowerRepetition = activityData.physicalActivities.filter(exercise =>
        lowerRepetitionExercises.includes(exercise)
      );

      const exercisesWithHigherRepetition = activityData.physicalActivities.filter(
        exercise => !lowerRepetitionExercises.includes(exercise)
      );

      const hasJoinedExercisesName = isWithoutLimitationType && isCustomSchedule;

      return (
        <>
          <Text>{handleRenderActivityDuration('less')}</Text>
          <div className={styles.tagContainer}>
            {exercisesWithLowerRepetition.map((exercise, index) => (
              <Tag key={index} className={styles.tag}>
                {physicalExercisesName[exercise as keyof typeof physicalExercisesName]}
              </Tag>
            ))}
          </div>
          <div className={styles.additionalDescriptionContainer}>
            <Text>{handleRenderActivityDuration('more')}</Text>
            <div className={styles.tagContainer}>
              {exercisesWithHigherRepetition.map((exercise, index) => (
                <Tag key={index} className={styles.tag}>
                  {hasJoinedExercisesName
                    ? withoutLimitationsPhysicalExercisesName[
                        exercise as unknown as keyof typeof withoutLimitationsPhysicalExercisesName
                      ]
                    : physicalExercisesName[exercise as keyof typeof physicalExercisesName]}
                </Tag>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (isPhysicalType && !isLowerRepetitionInPhysicalType) {
      return (
        <>
          <Text>{handleRenderActivityDuration()}</Text>
          <div className={styles.tagContainer}>
            {activityData.physicalActivities.map((exercise, index) => (
              <Tag key={index} className={styles.tag}>
                {physicalExercisesName[exercise as keyof typeof physicalExercisesName]}
              </Tag>
            ))}
          </div>
        </>
      );
    }

    if (isBreathingType && activityData.breathingExercises) {
      return (
        <>
          <Text>{handleRenderActivityDuration()}</Text>
          <div className={styles.tagContainer}>
            {activityData.breathingExercises.map((exercise, index) => (
              <Tag key={index} className={styles.tag}>
                {breathingExercisesName[exercise as keyof typeof breathingExercisesName]}
              </Tag>
            ))}
          </div>
        </>
      );
    }

    return <Text>{handleRenderActivityDuration()}</Text>;
  };

  return (
    <div className={styles.container}>
      <div>
        <ActivityIcon activityType={activityType} />
      </div>
      <div className={styles.descriptionContainer}>
        <Title level={6} className={styles.activityTitle}>
          {activityTitle[activityType]}
        </Title>
        {handleRenderActivityDescriptionAndLabel()}
      </div>
    </div>
  );
};

export default ActivityDescription;
