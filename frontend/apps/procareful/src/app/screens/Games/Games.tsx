import { useUserControllerGetGameDashboard } from '@Procareful/common/api';
import { type Key, useTypedTranslation, ProcarefulAppPathRoutes } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { Spin } from 'antd';
import GameTile from './GameTile';
import { excludeDailyGame, formatGameName } from './helpers';
import { useStyles } from './styles';

const Games = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { data: gameData, isLoading } = useUserControllerGetGameDashboard();

  if (isLoading) {
    return <Spin />;
  }

  const handleDescription = gameData?.details.completed
    ? t('senior_games_description_congratulations')
    : t('senior_games_description_unlock_more_games');

  return (
    <TopBarLayout backTo={ProcarefulAppPathRoutes.Dashboard}>
      <div className={styles.container}>
        {gameData?.details.todayGameName && (
          <>
            <div className={styles.header}>
              <Text className={styles.todayGameText} strong>
                {t('senior_title_today_game')}
              </Text>
            </div>
            <GameTile
              title={formatGameName(gameData?.details.todayGameName)}
              description={t(`senior_games_description_${gameData?.details.todayGameName}` as Key)}
              path={gameData?.details.todayGameName}
              completed={gameData?.details.completed}
              type="todayGame"
            />
          </>
        )}
        <div className={styles.otherGamesContainer}>
          <div className={styles.moreGamesHeader}>
            <Text strong>{t('senior_title_play_more')}</Text>
            <Text>{handleDescription}</Text>
          </div>
          {excludeDailyGame(gameData?.details.todayGameName).map(({ name, gameCode }) => (
            <GameTile
              key={name}
              title={name}
              description={t(`senior_games_description_${gameCode}` as Key)}
              path={gameCode}
              completed={gameData?.details.completed}
            />
          ))}
        </div>
      </div>
    </TopBarLayout>
  );
};

export default Games;
