import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import { NO_VALUE_PLACEHOLDER } from '@ProcarefulAdmin/pages/Dashboard/FormalCaregiverDashboard/CognitiveGamesChart/constants';
import HeatMap from '@ProcarefulAdmin/pages/Dashboard/HeatMap';
import NoDataPlaceholder from '@ProcarefulAdmin/pages/Dashboard/NoDataPlaceholder';
import { displayGameName } from '@ProcarefulAdmin/utils/displayGameName';
import { formatSeconds } from '@ProcarefulAdmin/utils/formatSeconds';
import {
  caregiverControllerGetCognitiveGamesEngagementPerformance,
  getCaregiverControllerGetCognitiveGamesEngagementPerformanceQueryKey,
  type GamesScoresPerUserDtoUserLeastPlayedGame,
  type GamesScoresPerUserDtoUserMostPlayedGame,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { placeholderConfig } from './constants';
import { useStyles } from './styles';

const CognitiveGamesEngagement = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get(SearchParams.Id));

  const { data, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: getCaregiverControllerGetCognitiveGamesEngagementPerformanceQueryKey(userId),
    queryFn: () => caregiverControllerGetCognitiveGamesEngagementPerformance(userId),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { pagination } = lastPage.details.gamesScores;

      if (!pagination) {
        return undefined;
      }
      const { page, totalPages } = pagination;

      if (page < totalPages) {
        return page + 1;
      }

      return undefined;
    },
  });

  const isDataAvailable = data?.pages.some(page =>
    page.details.gamesScores.items?.some(item => item.averageDailyTime !== 0)
  );

  const {
    userLeastPlayedGame,
    userMostPlayedGame,
    averageDailyTime = 0,
  } = data?.pages[0].details.gamesScores?.items?.[0] || {};

  const headerConfig = [
    {
      title: t('admin_title_average_game_time'),
      value: formatSeconds(averageDailyTime) || NO_VALUE_PLACEHOLDER,
    },
    {
      title: t('admin_table_most_played_game'),
      value:
        displayGameName(userMostPlayedGame as GamesScoresPerUserDtoUserMostPlayedGame) ||
        NO_VALUE_PLACEHOLDER,
    },
    {
      title: t('admin_table_least_played_game'),
      value:
        displayGameName(userLeastPlayedGame as GamesScoresPerUserDtoUserLeastPlayedGame) ||
        NO_VALUE_PLACEHOLDER,
    },
  ];

  return (
    <ChartLayout
      title={t('admin_title_cognitive_games_engagement')}
      subtitle={t('admin_table_last_30_days')}
      shadowContainer={false}
      description={t('admin_table_check_senior_cognitive_trainings_time')}
      chartType="bar"
      fitContent
      showHeatMapLegend
      className={styles.mainContainer}
      graphContainerClassName={styles.graphContainer}
      containerBordered
    >
      <div className={styles.heatMapContainer}>
        <div className={styles.header}>
          {headerConfig.map(({ title, value }, index) => (
            <div className={styles.headerElement} key={index}>
              <Text className={styles.upperText}>{title}</Text>
              <Text strong className={styles.bottomText}>
                {value}
              </Text>
            </div>
          ))}
        </div>
        {isDataAvailable ? (
          <HeatMap
            seniorsData={data?.pages || []}
            isLoading={isLoading}
            isLoadingNextPage={isFetchingNextPage}
          />
        ) : (
          <NoDataPlaceholder {...placeholderConfig} />
        )}
      </div>
    </ChartLayout>
  );
};

export default CognitiveGamesEngagement;
