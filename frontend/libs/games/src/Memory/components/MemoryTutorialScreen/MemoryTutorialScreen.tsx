import MemoryGif from '@ProcarefulGamesAssets/memoryGif.gif';
import { Button, Image } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type MemoryTutorialScreenProps = {
  onChangeScreenVisibility: () => void;
};

const MemoryTutorialScreen = ({ onChangeScreenVisibility }: MemoryTutorialScreenProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.gif}>
        <Image src={MemoryGif} preview={false} alt="memory gif" />
      </div>
      <Title level={6} className={styles.title}>
        {t('senior_games_memory_tutorial_title')}
      </Title>
      <Text className={styles.text}>{t('senior_games_memory_tutorial_text')}</Text>
      <Button
        className={styles.button}
        type="primary"
        onClick={onChangeScreenVisibility}
        size="large"
      >
        {t('senior_games_play')}
      </Button>
    </div>
  );
};

export default MemoryTutorialScreen;
