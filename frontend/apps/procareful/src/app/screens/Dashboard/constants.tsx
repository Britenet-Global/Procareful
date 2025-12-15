import HeadGear from '@Procareful/ui/assets/icons/cognitive-icon.svg?react';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import WavesIcon from '@mui/icons-material/Waves';
import { cx } from 'antd-style';
import { styles } from './styles';

export type ActivityType = 'game' | 'strength' | 'breath' | 'walking' | 'book' | 'diary';

export const activityIconVariants: Record<ActivityType, JSX.Element> = {
  game: <HeadGear className={cx(styles.icon)} />,
  strength: <FitnessCenterIcon className={cx(styles.icon, styles.purple)} />,
  breath: <WavesIcon className={cx(styles.icon, styles.purple)} />,
  walking: <DirectionsWalkIcon className={cx(styles.icon, styles.purple)} />,
  book: <SpaOutlinedIcon className={cx(styles.icon, styles.blue)} />,
  diary: <MenuBookIcon className={cx(styles.icon, styles.blue)} />,
};
