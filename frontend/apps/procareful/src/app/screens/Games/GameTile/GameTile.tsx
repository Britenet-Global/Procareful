import { capitalizeFirstLetter, ProcarefulAppPathRoutes } from '@Procareful/common/lib';
import { Paragraph, Text } from '@Procareful/ui';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import type { ImagesKeys, GamesKeys } from '../types';
import { images } from './constants';
import { useStyles } from './styles';

type GameTileProps = {
  key?: string;
  title: string;
  description: string;
  path: string;
  completed?: boolean;
  type?: 'todayGame' | 'playMore';
};

const GameTile = ({ title, description, path, completed, type = 'playMore' }: GameTileProps) => {
  const { cx, styles } = useStyles();
  const imagePath = images[path as keyof ImagesKeys];
  const pathFirstLetterCapitalized = capitalizeFirstLetter(path);
  const currentPath = ProcarefulAppPathRoutes[pathFirstLetterCapitalized as keyof GamesKeys];

  return (
    <Link
      to={currentPath}
      className={cx(styles.card, { [styles.disabled]: !completed && type !== 'todayGame' })}
    >
      <Image preview={false} src={imagePath} alt={path} />
      <div className={styles.container}>
        <Text strong>{title}</Text>
        <Paragraph>{description}</Paragraph>
      </div>
      <div className={styles.imageWrapper}>
        <NavigateNextIcon />
      </div>
    </Link>
  );
};

export default GameTile;
