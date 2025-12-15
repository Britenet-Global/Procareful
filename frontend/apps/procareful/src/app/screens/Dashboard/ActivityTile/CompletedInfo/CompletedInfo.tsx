import { type Key, useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import type { ActivityType } from '../../constants';
import { useStyles } from './styles';

type CompletedInfoProps = {
  type: ActivityType;
};

const CompletedInfo = ({ type }: CompletedInfoProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const completedText = type === 'game' ? 'senior_title_game_tile' : 'senior_title_completed';

  return (
    <div className={styles.completedContainer}>
      <Text>{t(completedText as Key)}</Text>
      <CheckOutlinedIcon className={styles.checkIcon} />
    </div>
  );
};

export default CompletedInfo;
