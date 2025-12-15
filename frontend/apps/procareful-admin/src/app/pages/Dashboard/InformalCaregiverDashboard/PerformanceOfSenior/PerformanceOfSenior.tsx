import { useEffect, useState } from 'react';
import { type SelectProps } from 'antd';
import CenteredSpinner from '@ProcarefulAdmin/components/CenteredSpinner';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import {
  type GetUsersForCaregiverWithImageDto,
  useCaregiverControllerGetUserPerformance,
  useCaregiverControllerGetUsers,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import NoDataPlaceholder from '../../NoDataPlaceholder';
import OverallEngagement from './OverallEngagement';
import { placeholderConfig } from './constants';
import { useStyles } from './styles';

const PerformanceOfSenior = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [userId, setUserId] = useState<number>(NaN);

  const { data: seniorsData, isLoading: isSeniorsDataLoading } = useCaregiverControllerGetUsers();

  const allSeniors = (seniorsData?.details.items as GetUsersForCaregiverWithImageDto[]) || [];

  const seniorsOption = allSeniors?.map(({ first_name, last_name, id }) => ({
    label: `${first_name} ${last_name}`,
    value: id,
  }));

  const { data: seniorPerformanceData, isLoading: isSeniorPerformanceLoading } =
    useCaregiverControllerGetUserPerformance(
      { userId },
      {
        query: {
          enabled: !!seniorsData && !!userId,
        },
      }
    );

  const selectMenus: SelectProps[] = [
    {
      id: '1',
      options: seniorsOption,
      defaultValue: seniorsOption[0]?.value ?? '',
      className: styles.select,
      allowClear: true,
      onChange: setUserId,
    },
  ];

  const isDataAvailable =
    seniorPerformanceData?.details &&
    Object.values(seniorPerformanceData?.details).some(value => value > 0);

  const renderChart = () => {
    if (isDataAvailable) {
      return (
        <OverallEngagement
          personalData={seniorPerformanceData}
          isPersonalDataLoading={isSeniorPerformanceLoading}
        />
      );
    }

    return <NoDataPlaceholder {...placeholderConfig} />;
  };

  useEffect(() => {
    const seniorId = seniorsData?.details.items[0]?.id;

    if (seniorId) {
      setUserId(seniorId);
    }
  }, [seniorsData]);

  if (isSeniorsDataLoading) {
    return (
      <ChartLayout
        title={t('admin_title_overall_engagement')}
        subtitle={t('admin_title_overall_engagement_track_senior_activity')}
        className={styles.card}
        description={t('admin_inf_description_overall_engagement')}
        containerBordered
      >
        <CenteredSpinner />
      </ChartLayout>
    );
  }

  return (
    <ChartLayout
      selectMenus={selectMenus}
      title={t('admin_title_overall_engagement')}
      subtitle={t('admin_title_overall_engagement_track_senior_activity')}
      className={styles.card}
      chartType="circular"
      description={t('admin_inf_description_overall_engagement')}
      descriptionClassName={styles.chartDescription}
    >
      {!isSeniorPerformanceLoading ? renderChart() : <CenteredSpinner />}
    </ChartLayout>
  );
};

export default PerformanceOfSenior;
