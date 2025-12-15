import Icon from '@ant-design/icons';
import { type ActivityDescriptionType } from '@ProcarefulAdmin/typings';
import CognitiveGameIcon from '@Procareful/ui/assets/icons/cognitive-icon.svg?react';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import WavesIcon from '@mui/icons-material/Waves';
import { useStyles } from './styles';

type ActivityIconProps = {
  activityType: ActivityDescriptionType;
};

const ActivityIcon = ({ activityType }: ActivityIconProps) => {
  const { styles, cx } = useStyles();

  const isPhysicalType = activityType === 'physicalActivities';
  const isWalkingType = activityType === 'walking';
  const isBreathingType = activityType === 'breathingExercises';
  const isCognitiveType = activityType === 'cognitiveGames';
  const isPersonalGrowth = activityType === 'personalGrowth';

  return (
    <div
      className={cx(styles.iconBackground, {
        [styles.physicalIconBackground]: isPhysicalType || isWalkingType,
        [styles.breathingIconBackground]: isBreathingType,
        [styles.cognitiveIconBackground]: isCognitiveType,
        [styles.personalGrowthBackground]: isPersonalGrowth,
      })}
    >
      {isPhysicalType && <FitnessCenterIcon className={cx(styles.physicalIcon, styles.icon)} />}
      {isWalkingType && <DirectionsWalkIcon className={cx(styles.physicalIcon, styles.icon)} />}
      {isBreathingType && <WavesIcon className={cx(styles.breathingIcon, styles.icon)} />}
      {isPersonalGrowth && (
        <SpaOutlinedIcon className={cx(styles.personalGrowthIcon, styles.icon)} />
      )}
      {isCognitiveType && (
        <Icon component={CognitiveGameIcon} className={cx(styles.cognitiveIcon, styles.icon)} />
      )}
    </div>
  );
};

export default ActivityIcon;
