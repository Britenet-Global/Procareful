import UserOutlined from '@ant-design/icons/UserOutlined';
import { Avatar, List, type SelectProps } from 'antd';
import CenteredSpinner from '@ProcarefulAdmin/components/CenteredSpinner';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import type { ChartProps } from '@ProcarefulAdmin/typings';
import {
  type AdminInstitutionControllerGetDashboardAdminViewSortOrder,
  type CaregiverWorkloadDto,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import NoDataPlaceholder from '../../NoDataPlaceholder';
import { placeholderConfig, selectItems } from './constants';
import { useStyles } from './styles';

type CaregiversWorkloadListProps = ChartProps & {
  caregiversWorkload: CaregiverWorkloadDto[];
  handleFilterChange: (
    value: AdminInstitutionControllerGetDashboardAdminViewSortOrder | undefined
  ) => void;
  isLoading: boolean;
};

const CaregiversWorkloadList = ({
  chartTitle,
  chartSubtitle,
  caregiversWorkload,
  handleFilterChange,
  isLoading,
}: CaregiversWorkloadListProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const selectMenus: SelectProps[] = [
    {
      id: 'sort_caregivers_workload',
      onChange: handleFilterChange,
      options: selectItems,
      value: t('admin_table_sort_order'),
      className: styles.select,
    },
  ];

  const isDataAvailable = caregiversWorkload.length > 0;

  const renderList = () => {
    if (isDataAvailable) {
      return (
        <List
          itemLayout="horizontal"
          dataSource={caregiversWorkload}
          renderItem={({ id, name, seniorCount, image }) => (
            <List.Item key={id}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    src={image ? `data:image/jpeg;base64,${image}` : undefined}
                  />
                }
                title={<Text strong>{name}</Text>}
                description={i18n.t('admin_title_seniors_amount', { count: seniorCount })}
              />
            </List.Item>
          )}
        />
      );
    }

    return <NoDataPlaceholder {...placeholderConfig} className={styles.placeholder} />;
  };

  return (
    <ChartLayout
      selectMenus={selectMenus}
      title={chartTitle}
      subtitle={chartSubtitle}
      shadowContainer
      className={styles.card}
    >
      <div className={styles.listContainer}>
        {!isLoading ? renderList() : <CenteredSpinner size="large" />}
      </div>
    </ChartLayout>
  );
};

export default CaregiversWorkloadList;
