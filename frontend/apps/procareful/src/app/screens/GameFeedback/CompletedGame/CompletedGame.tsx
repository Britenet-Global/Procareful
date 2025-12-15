import {
  type GameData,
  ProcarefulAppPathRoutes,
  SearchParams,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import WonGif from '@Procareful/ui/assets/gifs/completed-game.gif';
import LostGif from '@ProcarefulAppAssets/lost-game.gif';
import { Trans } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Image } from 'antd';
import { useStyles } from './styles';

type CompletedGameProps = {
  status: GameData['status'];
  points?: number;
  time: string;
  type?: GameData['feedbackType'];
};

const CompletedGame = ({ status, points = 0, type }: CompletedGameProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const shouldShowTrophyIcon = status === 'won';
  const shouldShowBrainIcon = status === 'lost' || status === 'aborted';
  const isGamePlayed = status === 'won' || status === 'lost';

  const handleCloseClick = () => {
    if (type === 'closingGameBeforeCompletion' || !type) {
      navigate(ProcarefulAppPathRoutes.Games);

      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(SearchParams.Step, '1');
    setSearchParams(newSearchParams);
  };

  const receivedPointsDescription = isGamePlayed ? (
    <Trans i18nKey="senior_games_finished_game_received_points_for_play" values={{ points }} />
  ) : (
    <Trans i18nKey="senior_games_finished_game_received_points_for_complete" values={{ points }} />
  );
  const gameHeading = shouldShowTrophyIcon
    ? t('senior_games_finished_game_successfully')
    : t('senior_games_finished_game_unsuccessfully');

  const finishedGameDescription =
    type === 'closingGameBeforeCompletion' ? (
      <Trans>{t('senior_inf_completed_game_abandoned')}</Trans>
    ) : (
      t('senior_games_finished_game_description')
    );

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <Title level={3}>{gameHeading}</Title>
        {points > 0 && <Text>{receivedPointsDescription}</Text>}
      </div>
      <div>
        {shouldShowTrophyIcon && (
          <Image src={WonGif} alt="gold trophy icon with fancy animation" preview={false} />
        )}
        {shouldShowBrainIcon && (
          <Image src={LostGif} alt="brain icon with fancy animation" preview={false} />
        )}
      </div>
      <div className={styles.descriptionContainer}>
        <Text>{finishedGameDescription}</Text>
      </div>
      <div className={styles.footerContainer}>
        <div className={styles.buttonContainer}>
          <Button type="primary" onClick={handleCloseClick} size="large">
            {t('admin_btn_close')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletedGame;
