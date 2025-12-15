import { Button, Image, Modal } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type GameTutorialModalProps = {
  open: boolean;
  tutorialGif: string;
  description: string;
  onCloseButtonClick: () => void;
};

const GameTutorialModal = ({
  open,
  tutorialGif,
  description,
  onCloseButtonClick,
}: GameTutorialModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <Modal open={open} footer={null} closable={false} maskClosable={false}>
      <div className={styles.container}>
        <div className={styles.gif}>
          <Image src={tutorialGif} alt="game gif" preview={false} />
        </div>
        <Text className={styles.text}>{description}</Text>
        <Button size="large" className={styles.button} type="primary" onClick={onCloseButtonClick}>
          {t('senior_games_modal_button_back_to_game')}
        </Button>
      </div>
    </Modal>
  );
};

export default GameTutorialModal;
