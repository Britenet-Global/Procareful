import { type ReactElement } from 'react';
import {
  activitiesLevel,
  activitiesModalConfig,
  lowerRepetitionExercises,
} from '@ProcarefulAdmin/constants';
import {
  breathingExercisesName,
  physicalExercisesName,
} from '@ProcarefulAdmin/pages/AssignActivities/constants';
import { transformExercises } from '@ProcarefulAdmin/pages/BuildCustomSchedule/helpers';
import {
  GenerateSchedulesDtoUserMobility,
  type GetUserScheduleDtoPersonalGrowth,
  type GeneratedSingleScheduleDtoPhysicalActivitiesItem,
  type GetUserScheduleDtoBreathingLevel,
  type GetUserScheduleDtoPhysicalLevel,
  type GetUserScheduleDtoUserWalkingExercises,
  type UserBreathingExerciseDto,
  type UserPhysicalExerciseDto,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, Tag } from '@Procareful/ui';
import {
  COGNITIVE_GAME_FREQUENCY_PER_DAY,
  COGNITIVE_GAME_FREQUENCY_PER_WEEK,
  activityDetailsTitle,
  personalChallengeName,
  walkingExerciseLevel,
} from './constants';
import { useStyles } from './styles';

type ActivityDetailsProps =
  | {
      type: 'physical';
      exercisesData: UserPhysicalExerciseDto[];
      level: GetUserScheduleDtoPhysicalLevel;
      limitationType: GenerateSchedulesDtoUserMobility;
      icon: ReactElement;
    }
  | {
      type: 'breathing';
      exercisesData: UserBreathingExerciseDto[];
      level: GetUserScheduleDtoBreathingLevel;
      limitationType: GenerateSchedulesDtoUserMobility;
      icon: ReactElement;
    }
  | {
      type: 'walking';
      exerciseData: GetUserScheduleDtoUserWalkingExercises;
      icon: ReactElement;
    }
  | {
      type: 'cognitiveGames';
      icon: ReactElement;
    }
  | {
      type: 'personalGrowth';
      challengeType?: GetUserScheduleDtoPersonalGrowth;
      isAssigned: boolean;
      icon?: ReactElement;
    };

const ActivityDetails = (props: ActivityDetailsProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { type, icon } = props;
  const isWalkingType = type === 'walking';
  const isPhysicalType = type === 'physical';
  const isBreathingType = type === 'breathing';
  const isBedriddenType =
    'limitationType' in props &&
    props.limitationType === GenerateSchedulesDtoUserMobility.bedridden_activities;
  const isPersonalGrowthType = type === 'personalGrowth';
  const isCognitiveGamesType = type === 'cognitiveGames';
  const isPersonalGrowthDisabled = isPersonalGrowthType && !props.challengeType;
  const isLowerRepetitionInPhysicalType =
    isPhysicalType &&
    props.exercisesData.some(exercise =>
      lowerRepetitionExercises.includes(
        exercise.name as unknown as GeneratedSingleScheduleDtoPhysicalActivitiesItem
      )
    );

  const renderActivityLevel = () => {
    if ((type === 'physical' || type === 'breathing') && props.level) {
      return (
        <>
          <Text>{`${t('admin_title_level')}: `}</Text>
          <Text>{activitiesLevel[props.level]}</Text>
        </>
      );
    }

    if (type === 'walking' && props.exerciseData?.walking_level) {
      return (
        <>
          <Text>{`${t('admin_title_level')}: `}</Text>
          <Text>{walkingExerciseLevel[props.exerciseData?.walking_level]}</Text>
        </>
      );
    }
  };

  const handleRenderActivityDuration = (repetitionType?: 'more' | 'less') => {
    if (isCognitiveGamesType) {
      return t('admin_inf_time_per_day_and_week', {
        frequencyPerDay: COGNITIVE_GAME_FREQUENCY_PER_DAY.toString(),
        frequencyPerWeek: COGNITIVE_GAME_FREQUENCY_PER_WEEK.toString(),
      });
    }

    if (isWalkingType) {
      return (
        props.exerciseData &&
        t('admin_inf_time_minutes_per_day', { count: props.exerciseData.time.toString() })
      );
    }

    if (isPersonalGrowthType) {
      return props.challengeType
        ? personalChallengeName[props.challengeType]
        : t('admin_inf_not_assigned');
    }

    const { breathingExercises, physicalActivities } =
      activitiesModalConfig[props.limitationType][props.level];
    const physicalActivityRepetitionFrequency = physicalActivities.frequencyRepetition;
    const isPhysicalRepetitionFrequencyNumberType =
      typeof physicalActivityRepetitionFrequency === 'number';

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
  };

  const handleRenderActivityDescriptionAndLabel = () => {
    if (isPhysicalType && isLowerRepetitionInPhysicalType) {
      const physicalExercises = transformExercises(props.exercisesData);
      const exercisesWithLowerRepetition = physicalExercises.filter(exercise =>
        lowerRepetitionExercises.includes(
          exercise as unknown as GeneratedSingleScheduleDtoPhysicalActivitiesItem
        )
      );

      const exercisesWithHigherRepetition = physicalExercises.filter(
        exercise =>
          !lowerRepetitionExercises.includes(
            exercise as unknown as GeneratedSingleScheduleDtoPhysicalActivitiesItem
          )
      );

      return (
        <>
          <Text>{handleRenderActivityDuration('less')}</Text>
          <div className={styles.tagContainer}>
            {exercisesWithLowerRepetition.map((exercise, index) => (
              <Tag key={index} className={styles.tag}>
                {physicalExercisesName[exercise as unknown as keyof typeof physicalExercisesName]}
              </Tag>
            ))}
          </div>
          <div className={styles.additionalDescriptionContainer}>
            <Text>{handleRenderActivityDuration('more')}</Text>
            <div className={styles.tagContainer}>
              {exercisesWithHigherRepetition.map((exercise, index) => (
                <Tag key={index} className={styles.tag}>
                  {physicalExercisesName[exercise as unknown as keyof typeof physicalExercisesName]}
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
            {props.exercisesData.map((exercise, index) => (
              <Tag key={index} className={styles.tag}>
                {
                  physicalExercisesName[
                    exercise.name as unknown as keyof typeof physicalExercisesName
                  ]
                }
              </Tag>
            ))}
          </div>
        </>
      );
    }

    if (isBreathingType && props.exercisesData) {
      return (
        <>
          <Text>{handleRenderActivityDuration()}</Text>
          <div className={styles.tagContainer}>
            {props.exercisesData.map((exercise, index) => (
              <Tag key={index} className={styles.tag}>
                {
                  breathingExercisesName[
                    exercise.name as unknown as keyof typeof breathingExercisesName
                  ]
                }
              </Tag>
            ))}
          </div>
        </>
      );
    }

    return (
      <Text
        className={cx({
          [styles.disabledText]: isPersonalGrowthDisabled,
        })}
      >
        {handleRenderActivityDuration()}
      </Text>
    );
  };

  return (
    <div
      className={cx(styles.container, {
        [styles.disabledContainer]: isPersonalGrowthDisabled,
      })}
    >
      {icon}
      <div>
        <Text className={cx(styles.bold, { [styles.disabledText]: isPersonalGrowthDisabled })}>
          {activityDetailsTitle[type]}
        </Text>
        <div
          className={cx(styles.levelContainer, {
            [styles.levelContainerLowerMargin]: isCognitiveGamesType || isPersonalGrowthType,
          })}
        >
          {renderActivityLevel()}
        </div>
        <div>{handleRenderActivityDescriptionAndLabel()}</div>
      </div>
    </div>
  );
};

export default ActivityDetails;
