import Icon from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useAssignActivitiesStore } from '@ProcarefulAdmin/store/assignActivitiesStore';
import type { AssignActivityTile } from '@ProcarefulAdmin/typings';
import type {
  GenerateSchedulesDtoRecommendedLevel,
  GenerateSchedulesDtoUserMobility,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Title, Text, Tag } from '@Procareful/ui';
import PlantIcon from '@Procareful/ui/assets/icons/plant-icon.svg?react';
import ProcarefulLogo from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { activitiesModalDescription } from '../constants';
import { AssignActivitiesParams, AssignChallengeType } from '../types';
import { useStyles } from './styles';

type ActivityTileProps = {
  title?: string;
  description?: string;
  activityType?: AssignActivityTile;
  recommendedType?: GenerateSchedulesDtoRecommendedLevel;
  limitationType?: GenerateSchedulesDtoUserMobility;
  className?: string;
  onLinkButtonClick?: () => void;
};

const ActivityTile = ({
  title,
  description,
  activityType,
  recommendedType,
  limitationType,
  className,
  onLinkButtonClick,
}: ActivityTileProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const seniorId = searchParams.get(SearchParams.Id);

  const { handleChangePickedActivity, handleChangePickedChallenge, assignActivitiesStore } =
    useAssignActivitiesStore(state => ({
      handleChangePickedActivity: state.handleChangePickedActivity,
      handleChangePickedChallenge: state.handleChangePickedChallenge,
      assignActivitiesStore: {
        light: state.light,
        moderate: state.moderate,
        intense: state.intense,
        custom: state.custom,
        youths: state.youths,
        peer: state.peer,
      },
    }));

  if (!activityType || !title || !seniorId) {
    return null;
  }

  const isModerateActivityType = activityType === 'moderate';
  const isIntenseActivityType = activityType === 'intense';
  const isCustomActivityType = activityType === 'custom';
  const isSelected = assignActivitiesStore[activityType].isPicked;
  const scheduleButtonText = isSelected ? t('admin_btn_deselect') : t('admin_btn_select_schedule');
  const challengeButtonText = isSelected
    ? t('admin_btn_deselect')
    : t('admin_btn_select_challenge');
  const linkText = isCustomActivityType ? t('shared_btn_edit') : t('admin_btn_see_details');
  const tileDescription =
    limitationType && !isCustomActivityType
      ? activitiesModalDescription[limitationType][
          activityType as GenerateSchedulesDtoRecommendedLevel
        ]
      : t('admin_inf_custom_schedule_description');
  const isScheduleTile =
    activityType !== AssignChallengeType.Peer && activityType !== AssignChallengeType.Youths;
  const isRecommendedSchedule = activityType === recommendedType;
  const hasStepParams = searchParams.has(SearchParams.Step);
  const stepParams = searchParams.get(SearchParams.Step) as AssignActivitiesParams;

  const primaryButtonText = {
    [AssignActivitiesParams.Challenge]: isScheduleTile ? scheduleButtonText : challengeButtonText,
    [AssignActivitiesParams.Summary]: t('shared_btn_edit'),
  };

  const handleRenderIcon = () => {
    if (activityType === 'custom') {
      return (
        <div className={cx(styles.colorContainer, styles.tealBackground)}>
          <SentimentSatisfiedAltIcon className={styles.smileIcon} />
        </div>
      );
    }

    if (activityType === AssignChallengeType.Peer || activityType === AssignChallengeType.Youths) {
      return (
        <div className={cx(styles.colorContainer, styles.lightOrangeBackground)}>
          <Icon component={PlantIcon} className={styles.logoIcon} />
        </div>
      );
    }

    return (
      <>
        {isIntenseActivityType && (
          <div className={cx(styles.colorContainer, styles.tealBackground)}>
            <Icon component={ProcarefulLogo} className={styles.logoIcon} />
          </div>
        )}
        {(isModerateActivityType || isIntenseActivityType) && (
          <div className={cx(styles.colorContainer, styles.marginContainer)}>
            <Icon component={ProcarefulLogo} className={styles.logoIcon} />
          </div>
        )}
        <div className={cx(styles.colorContainer, styles.tealBackground)}>
          <Icon component={ProcarefulLogo} className={styles.logoIcon} />
        </div>
      </>
    );
  };

  const handleSeeDetailsClick = () => {
    if (activityType === 'custom') return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(SearchParams.Preview, activityType);
    setSearchParams(newSearchParams.toString());
  };

  const handleClickPrimaryButton = () => {
    if (
      (isCustomActivityType && hasStepParams) ||
      (isScheduleTile && stepParams === AssignActivitiesParams.Summary)
    ) {
      searchParams.delete(SearchParams.Step);
      const newSearchParams = new URLSearchParams(searchParams);
      setSearchParams(newSearchParams, { replace: true });

      return;
    }

    if (isScheduleTile && !hasStepParams) {
      return handleChangePickedActivity(activityType);
    }

    if (!isScheduleTile && stepParams === AssignActivitiesParams.Challenge) {
      return handleChangePickedChallenge(activityType);
    }

    if (!isScheduleTile && stepParams === AssignActivitiesParams.Summary) {
      searchParams.delete(SearchParams.Step);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(SearchParams.Step, AssignActivitiesParams.Challenge);
      setSearchParams(newSearchParams, { replace: true });

      return;
    }
  };

  const handleRenderSecondaryButton = () => {
    if (!isScheduleTile || (isCustomActivityType && hasStepParams)) {
      return null;
    }

    return (
      <Button
        type="link"
        className={styles.detailsButton}
        onClick={onLinkButtonClick || handleSeeDetailsClick}
      >
        {linkText}
      </Button>
    );
  };

  return (
    <StyledCard className={cx(styles.container, { [styles.greenBorder]: isSelected }, className)}>
      <div>
        <div className={styles.headerContainer}>
          <div className={styles.tagContainer}>
            <Title level={4}>{title}</Title>
            {isRecommendedSchedule && <Tag customColor="teal">{t('admin_inf_recommended')}</Tag>}
          </div>
          <div className={styles.logoContainer}>{handleRenderIcon()}</div>
        </div>
        <div className={styles.descriptionContainer}>
          <Text>{description || tileDescription}</Text>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button className={styles.button} onClick={handleClickPrimaryButton}>
          {hasStepParams ? primaryButtonText[stepParams] : scheduleButtonText}
        </Button>
        {handleRenderSecondaryButton()}
      </div>
    </StyledCard>
  );
};

export default ActivityTile;
