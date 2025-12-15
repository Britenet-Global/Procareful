import { createPortal } from 'react-dom';
import { Button } from 'antd';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { NoOneWon } from '../constants';
import { type Winner } from '../helpers';
import { useStyles } from './styles';

type InfoModalProps = {
  isUserWinner: boolean;
  winner: Winner | null;
  onClick: () => void;
};

const InfoModal = ({ isUserWinner, winner, onClick }: InfoModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const portalContainer = document.getElementById('portal');

  if (!portalContainer) {
    return null;
  }

  const headingText = isUserWinner
    ? t('senior_games_modal_congratulation')
    : t('senior_games_modal_lost');

  const descriptionText = !isUserWinner
    ? t('senior_games_lets_try_again_in_the_next_round')
    : t('senior_games_ready_for_next_round');

  const renderSpinnerPortal = createPortal(
    <div className={styles.modalContainer}>
      <div className={styles.infoContainer}>
        <div className={styles.headingContainer}>
          <div className={styles.container}>
            <Text strong className={styles.heading}>
              {winner === NoOneWon.Draw ? t('senior_games_modal_draw_title') : headingText}
            </Text>
          </div>
          <div className={styles.descriptionContainer}>
            <Text>
              {winner === NoOneWon.Draw
                ? t('senior_games_ready_for_another_round')
                : descriptionText}
            </Text>
          </div>
        </div>
        <Button onClick={onClick} className={styles.button} size="large" type="primary">
          {t('senior_games_modal_button_lets_go')}
        </Button>
      </div>
    </div>,
    portalContainer
  );

  return renderSpinnerPortal;
};

export default InfoModal;
