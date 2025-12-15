import { useInfiniteQuery } from '@tanstack/react-query';
import sample from 'lodash/sample';
import { type SelectProps } from 'antd';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import { NO_VALUE_PLACEHOLDER } from '@ProcarefulAdmin/pages/Dashboard/FormalCaregiverDashboard/CognitiveGamesChart/constants';
import { displayGameName } from '@ProcarefulAdmin/utils/displayGameName';
import { formatSeconds } from '@ProcarefulAdmin/utils/formatSeconds';
import {
  type GetGamesEngagementDtoLeastPlayedGame,
  type GetGamesEngagementDtoMostPlayedGame,
  useCaregiverControllerGetUsers,
  type CaregiverControllerGetCognitiveGamesEngagementParams,
  type GetUsersForCaregiverWithImageDto,
  getCaregiverControllerGetCognitiveGamesEngagementQueryKey,
  caregiverControllerGetCognitiveGamesEngagement,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import HeatMap from '../../HeatMap';
import NoDataPlaceholder from '../../NoDataPlaceholder';
import { placeholderConfig } from './constants';
import { useStyles } from './styles';

const GamesEngagementChart = () => {
  const { cx, styles } = useStyles();
  const { t } = useTypedTranslation();

  const {
    filters: { userId },
    handleFilterChange,
  } = useTableFilter<CaregiverControllerGetCognitiveGamesEngagementParams>({
    userId: undefined,
  });

  const { data: seniorsData } = useCaregiverControllerGetUsers();

  const {
    data: gamesEngagementData,
    isLoading: isGamesDataLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: getCaregiverControllerGetCognitiveGamesEngagementQueryKey({ userId }),
    queryFn: ({ pageParam }) => caregiverControllerGetCognitiveGamesEngagement({ page: pageParam }),
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

  const isDataAvailable = gamesEngagementData?.pages.some(page =>
    page.details.gamesScores.items?.some(item => item.averageDailyTime !== 0)
  );

  const { averageDailyGameTime, leastPlayedGame, mostPlayedGame } =
    gamesEngagementData?.pages[0].details || {};

  const selectOptions = seniorsData?.details.items.map(
    ({ first_name, last_name, id }: GetUsersForCaregiverWithImageDto) => ({
      label: `${first_name} ${last_name}`,
      value: id,
    })
  );

  const selectMenus: SelectProps[] = [
    {
      id: '1',
      onChange: handleFilterChange('userId'),
      options: selectOptions,
      placeholder: t('admin_btn_all'),
      className: styles.select,
      allowClear: true,
    },
  ];

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
      selectMenus={selectMenus}
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
        <div
          className={cx(styles.header, {
            [styles.addMargin]: !isDataAvailable,
          })}
        >
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
            seniorsData={gamesEngagementData?.pages || []}
            isLoading={isGamesDataLoading}
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

export default GamesEngagementChart;
