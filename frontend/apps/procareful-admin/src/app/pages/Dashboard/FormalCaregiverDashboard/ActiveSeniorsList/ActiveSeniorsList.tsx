import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Avatar, List, Spin, type SelectProps } from 'antd';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import {
  type CaregiverControllerGetMostActiveSeniorsParams,
  useCaregiverControllerGetMostActiveSeniors,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import NoDataPlaceholder from '../../NoDataPlaceholder';
import { placeholderConfig, selectItems } from './constants';
import { useStyles } from './styles';

const ActiveSeniorsList = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const {
    filters: { sortOrder },
    handleFilterChange,
  } = useTableFilter<CaregiverControllerGetMostActiveSeniorsParams>({
    sortOrder: undefined,
  });

  const { data: seniorsData, isLoading } = useCaregiverControllerGetMostActiveSeniors({
    sortOrder,
  });

  const selectMenus: SelectProps[] = [
    {
      id: 'sort_most_active_senior',
      options: selectItems,
      onChange: handleFilterChange('sortOrder'),
      className: styles.select,
      value: t('admin_table_sort_order'),
    },
  ];

  const isDataAvailable = seniorsData?.details && seniorsData?.details.length > 0;

  const navigateToSenior = (id: number) => {
    const navigateToSeniorConfig = {
      pathname: PathRoutes.SeniorProfile,
      search: new URLSearchParams({
        [SearchParams.Id]: id.toString(),
      }).toString(),
    };

    navigate(navigateToSeniorConfig);
  };

  return (
    <ChartLayout
      selectMenus={selectMenus}
      title={t('admin_table_most_active_seniors')}
      subtitle={t('admin_table_last_30_days')}
      shadowContainer
      className={styles.card}
      fitContent
    >
      {!isLoading ? (
        <div className={styles.listContainer}>
          {isDataAvailable ? (
            <List
              itemLayout="horizontal"
              dataSource={seniorsData.details}
              renderItem={({ avatar, completionRate, fullName, id }) => (
                <List.Item
                  key={id}
                  onClick={() => navigateToSenior(id)}
                  className={styles.listItem}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        src={avatar ? `data:image/jpeg;base64,${avatar}` : undefined}
                      />
                    }
                    title={<Text strong>{fullName}</Text>}
                    description={t('admin_table_percentage_of_completed_activities', {
                      count: String(completionRate),
                    })}
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className={styles.noDataPlaceholder}>
              <NoDataPlaceholder {...placeholderConfig} />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}
    </ChartLayout>
  );
};

export default ActiveSeniorsList;
