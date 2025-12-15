import Icon from '@ant-design/icons';
import { Text } from '@Procareful/ui';
import LogoSvg from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import type { Round } from '../../typings';
import ProgressBar from './ProgressBar';
import { useStyles } from './styles';

type SummaryContainerProps = {
  points?: number;
  hints?: number;
  time?: string;
  hearts?: number;
  gameRounds?: Round[];
  handleOnHintsClick?: () => void;
};

const SummaryContainer = ({
  points,
  hints,
  time,
  hearts,
  gameRounds,
  handleOnHintsClick,
}: SummaryContainerProps) => {
  const { styles, cx } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.elementContainer}>
        <Icon component={LogoSvg} className={styles.logoIcon} />
        <Text className={styles.text}>{points}</Text>
      </div>
      {typeof hearts === 'number' && (
        <div className={styles.heartContainer}>
          <FavoriteIcon className={cx(styles.heartIcon, styles.icon)} />
          <Text className={styles.text}>{hearts}</Text>
        </div>
      )}
      {typeof hints === 'number' && (
        <div className={styles.elementContainer} onClick={handleOnHintsClick}>
          <LightbulbOutlinedIcon className={cx(styles.bulbIcon, styles.icon)} />
          <Text className={styles.text}>{hints}</Text>
        </div>
      )}
      {time && (
        <div className={styles.elementContainer}>
          <AccessTimeIcon className={cx(styles.timeIcon, styles.icon)} />
          <Text className={styles.text}>{time}</Text>
        </div>
      )}
      {gameRounds && (
        <div className={styles.stepsContainer}>
          <ProgressBar playedRounds={gameRounds} />
        </div>
      )}
    </div>
  );
};

export default SummaryContainer;
