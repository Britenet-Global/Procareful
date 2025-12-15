import { useSearchParams } from 'react-router-dom';
import { Button, Modal } from 'antd';
import ActivityDescription from '@ProcarefulAdmin/components/ActivityDescription';
import { activitiesLevel } from '@ProcarefulAdmin/constants';
import { useAssignActivitiesStore } from '@ProcarefulAdmin/store/assignActivitiesStore';
import type {
  GenerateSchedulesDto,
  GenerateSchedulesDtoRecommendedLevel,
  GenerateSchedulesDtoUserMobility,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Title, Text } from '@Procareful/ui';
import { activitiesModalDescription } from '../constants';
import { useStyles } from './styles';

type ScheduleDetailsModalProps = {
  limitationType?: GenerateSchedulesDtoUserMobility;
  activitiesScheduleData?: GenerateSchedulesDto;
  isVisible: boolean;
  toggleModal: () => void;
};

const ScheduleDetailsModal = ({
  limitationType,
  isVisible,
  toggleModal,
  activitiesScheduleData,
}: ScheduleDetailsModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activityLevel = searchParams.get(
    SearchParams.Preview
  ) as GenerateSchedulesDtoRecommendedLevel;
  const { handleChangePickedActivity, assignActivitiesStore } = useAssignActivitiesStore(state => ({
    handleChangePickedActivity: state.handleChangePickedActivity,
    assignActivitiesStore: {
      light: state.light,
      moderate: state.moderate,
      intense: state.intense,
    },
  }));

  if (!activityLevel || !limitationType || !activitiesScheduleData) {
    return null;
  }

  const activityDescription = activitiesModalDescription[limitationType][activityLevel];

  const activityData = activitiesScheduleData[activityLevel];

  const handleSelectSchedule = () => {
    if (!assignActivitiesStore[activityLevel].isPicked) {
      handleChangePickedActivity(activityLevel);
    }

    searchParams.delete(SearchParams.Preview);
    const newSearchParams = new URLSearchParams(searchParams);
    setSearchParams(newSearchParams, { replace: true });
  };

  return (
    <Modal
      title={t('admin_inf_schedule_details')}
      centered
      maskClosable={false}
      open={isVisible}
      className={styles.modal}
      footer={null}
      onCancel={toggleModal}
      keyboard={false}
    >
      <div>
        <div className={styles.titleContainer}>
          <Title level={4}>{activitiesLevel[activityLevel]}</Title>
          <Text>{activitiesLevel[activityLevel]}</Text>
          <Text>{activityDescription}</Text>
        </div>
        <div className={styles.activitiesOverview}>
          <Title level={6} className={styles.activitiesOverviewTitle}>
            {t('admin_title_activities_overview')}
          </Title>
          <ActivityDescription
            activityType="physicalActivities"
            activityData={activityData}
            activityLevel={activityLevel}
            limitationType={limitationType}
          />
          {!!activityData.walkingTime && (
            <ActivityDescription
              activityType="walking"
              activityData={activityData}
              activityLevel={activityLevel}
              limitationType={limitationType}
            />
          )}
          <ActivityDescription
            activityType="breathingExercises"
            activityData={activityData}
            activityLevel={activityLevel}
            limitationType={limitationType}
          />
          <ActivityDescription
            activityType="cognitiveGames"
            activityData={activityData}
            activityLevel={activityLevel}
            limitationType={limitationType}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button type="primary" onClick={handleSelectSchedule}>
          {t('admin_btn_select_schedule')}
        </Button>
      </div>
    </Modal>
  );
};

export default ScheduleDetailsModal;
