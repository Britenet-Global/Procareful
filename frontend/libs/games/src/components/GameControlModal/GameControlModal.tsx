import { Button, Modal } from 'antd';
import { Text, Title } from '@Procareful/ui';
import { gameResult } from './constants';
import { useStyles } from './styles';

type CompletionModalProps = {
  open: boolean;
  type: 'won' | 'lost' | 'draw' | 'checkActivity' | 'endGame';
  onFirstButtonClick: () => void;
  onSecondButtonClick?: () => void;
};

const GameControlModal = ({
  open,
  type,
  onFirstButtonClick,
  onSecondButtonClick,
}: CompletionModalProps) => {
  const { styles } = useStyles();

  const { title, description, anotherRound, firstButton, secondButton } = gameResult[type] || {};

  return (
    <Modal centered open={open} footer={null} closable={false} maskClosable={false}>
      <div className={styles.contentContainer}>
        <Title level={6}>{title}</Title>
        {description && <Text className={styles.description}>{description}</Text>}
        {anotherRound && <Text>{anotherRound}</Text>}
        <Button size="large" type="primary" onClick={onFirstButtonClick} className={styles.button}>
          {firstButton}
        </Button>
        {secondButton && onSecondButtonClick && (
          <Button size="large" onClick={onSecondButtonClick} className={styles.secondButton}>
            {secondButton}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default GameControlModal;
