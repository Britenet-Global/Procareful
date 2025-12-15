import { ProcarefulAppPathRoutes } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import BrainIcon from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Settings from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';
import { useStyles } from './styles';

type TopBarProps = {
  points: number;
  trophies?: number;
};

const TopBar = ({ points, trophies }: TopBarProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.topBar}>
      <div className={styles.wrapper}>
        <div className={styles.topBarElement}>
          <Text className={styles.topBarText}>{points}</Text>
          <BrainIcon className={styles.brainLogo} />
        </div>
        <div className={styles.topBarElement}>
          <Text className={styles.topBarText}>{trophies || 0}</Text>
          <EmojiEventsOutlinedIcon className={styles.trophyIcon} />
        </div>
      </div>
      <Link className={styles.link} to={ProcarefulAppPathRoutes.Settings}>
        <Settings className={styles.settingsIcon} />
      </Link>
    </div>
  );
};

export default TopBar;
