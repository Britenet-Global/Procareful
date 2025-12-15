import { useInfiniteQuery } from '@tanstack/react-query';
import sample from 'lodash/sample';
import { useMediaQuery } from 'react-responsive';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import { displayGameName } from '@ProcarefulAdmin/utils/displayGameName';
import { formatSeconds } from '@ProcarefulAdmin/utils/formatSeconds';
import {
  type GetGamesEngagementDtoMostPlayedGame,
  type GetGamesEngagementDtoLeastPlayedGame,
  caregiverControllerGetCognitiveGamesEngagement,
  getCaregiverControllerGetCognitiveGamesEngagementQueryKey,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import HeatMap from '../../HeatMap';
import NoDataPlaceholder from '../../NoDataPlaceholder';
import { NO_VALUE_PLACEHOLDER, placeholderConfig } from './constants';
import { useStyles } from './styles';

const CognitiveGamesChart = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const isBigScreen = useMediaQuery({ query: '(min-width: 2000px)' });

  const pageSize = isBigScreen ? 20 : 10;

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: getCaregiverControllerGetCognitiveGamesEngagementQueryKey({ pageSize }),
    queryFn: ({ pageParam }) =>
      caregiverControllerGetCognitiveGamesEngagement({ page: pageParam, pageSize }),
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

  const { averageDailyGameTime, leastPlayedGame, mostPlayedGame } = data?.pages[0].details || {};

  const isDataAvailable = data?.pages.some(page =>
    page.details.gamesScores.items?.some(item => item.averageDailyTime !== 0)
  );

  const headerConfig = [
    {
      title: t('admin_title_average_game_time'),
      value: formatSeconds(averageDailyGameTime) || NO_VALUE_PLACEHOLDER,
    },
    {
      title: t('admin_table_most_played_game'),
      value:
        displayGameName(sample(mostPlayedGame) as GetGamesEngagementDtoMostPlayedGame) ||
        NO_VALUE_PLACEHOLDER,
    },
    {
      title: t('admin_table_least_played_game'),
      value:
        displayGameName(sample(leastPlayedGame) as GetGamesEngagementDtoLeastPlayedGame) ||
        NO_VALUE_PLACEHOLDER,
    },
  ];

  return (
    <ChartLayout
      title={t('admin_title_cognitive_games_engagement')}
      subtitle={t('admin_table_last_30_days')}
      shadowContainer
      description={t('admin_table_check_senior_cognitive_trainings_time')}
      chartType="bar"
      fitContent
      showHeatMapLegend
      className={styles.mainContainer}
    >
      <div className={styles.heatMapContainer}>
        <div className={styles.header}>
          {headerConfig.map(({ title, value }, index) => (
            <div className={styles.headerElement} key={index}>
              <Text className={styles.upperText}>{title}</Text>
              <Text strong className={styles.bottomText}>
                {isDataAvailable ? value : NO_VALUE_PLACEHOLDER}
              </Text>
            </div>
          ))}
        </div>
        {isDataAvailable ? (
          <HeatMap
            seniorsData={data?.pages || []}
            isLoading={isLoading}
            isLoadingNextPage={isFetchingNextPage}
            onReachEnd={() => hasNextPage && fetchNextPage()}
          />
        ) : (
          <NoDataPlaceholder {...placeholderConfig} />
        )}
      </div>
    </ChartLayout>
  );
};

export default CognitiveGamesChart;
