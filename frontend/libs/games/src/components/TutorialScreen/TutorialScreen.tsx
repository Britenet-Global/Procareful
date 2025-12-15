import { Button, Image } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type TutorialScreenProps = {
  tutorialGif: string;
  title: string;
  description: string;
  onPlayButtonClick: () => void;
};

const TutorialScreen = ({
  tutorialGif,
  title,
  description,
  onPlayButtonClick,
}: TutorialScreenProps) => {
  const { styles, theme } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.gif}>
        <Image src={tutorialGif} alt="game gif" preview={false} />
      </div>
      <Title level={theme.fontSize > 16 ? 3 : 4} className={styles.title}>
        {title}
      </Title>
      <Text className={styles.text}>{description}</Text>
      <Button size="large" className={styles.button} type="primary" onClick={onPlayButtonClick}>
        {t('senior_games_play')}
      </Button>
    </div>
  );
};

export default TutorialScreen;
