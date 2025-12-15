import { Button, Modal } from 'antd';
import ActivityDescription from '@ProcarefulAdmin/components/ActivityDescription';
import {
  type CustomScheduleFormValues,
  useAssignActivitiesStore,
} from '@ProcarefulAdmin/store/assignActivitiesStore';
import {
  GenerateSchedulesDtoRecommendedLevel,
  GenerateSchedulesDtoUserMobility,
  type GetWalkingTime,
  type GeneratedSingleScheduleDto,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Title, Text } from '@Procareful/ui';
import { useStyles } from './styles';

type LimitationDataType =
  | CustomScheduleFormValues['formValues']['bedriddenLimitation']
  | CustomScheduleFormValues['formValues']['mobilityLimitation']
  | CustomScheduleFormValues['formValues']['withoutLimitation'];

type CustomScheduleDetailsModalProps = {
  limitationType: GenerateSchedulesDtoUserMobility;
  isVisible: boolean;
  toggleModal: () => void;
  onConfirm: () => void;
  walkingTimeData?: GetWalkingTime;
  isLoading: boolean;
};

const CustomScheduleDetailsModal = ({
  limitationType,
  isVisible,
  toggleModal,
  onConfirm,
  walkingTimeData,
  isLoading,
}: CustomScheduleDetailsModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const { customSchedule } = useAssignActivitiesStore(state => ({
    customSchedule: state.custom,
  }));

  const { bedriddenLimitation, mobilityLimitation, withoutLimitation } = customSchedule.formValues;

  const customActivityData: Record<GenerateSchedulesDtoUserMobility, LimitationDataType> = {
    [GenerateSchedulesDtoUserMobility.bedridden_activities]: bedriddenLimitation,
    [GenerateSchedulesDtoUserMobility.mobility_limitation_activities]: mobilityLimitation,
    [GenerateSchedulesDtoUserMobility.without_limitation_activities]: withoutLimitation,
  };

  if (!limitationType) {
    return null;
  }

  const activityDataByLimitationType = customActivityData[limitationType];
  const isWalkingTimeExist =
    'walkingTime' in activityDataByLimitationType && !!activityDataByLimitationType.walkingTime;

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
          <Title level={4}>{t('admin_title_custom_schedule')}</Title>
          <Text>{t('admin_inf_personalized')}</Text>
          <Text>{t('admin_inf_custom_schedule_description')}</Text>
        </div>
        <div className={styles.activitiesOverview}>
          <Title level={6} className={styles.activitiesOverviewTitle}>
            {t('admin_title_activities_overview')}
          </Title>
          <ActivityDescription
            activityType="physicalActivities"
            activityData={activityDataByLimitationType as unknown as GeneratedSingleScheduleDto}
            activityLevel={
              customActivityData[limitationType]
                .physicalActivitiesLevel as unknown as GenerateSchedulesDtoRecommendedLevel
            }
            limitationType={limitationType}
            isCustomSchedule
          />
          {isWalkingTimeExist && (
            <ActivityDescription
              activityType="walking"
              activityData={activityDataByLimitationType as unknown as GeneratedSingleScheduleDto}
              activityLevel={GenerateSchedulesDtoRecommendedLevel.moderate}
              limitationType={limitationType}
              walkingTimeData={walkingTimeData}
              isCustomSchedule
            />
          )}
          <ActivityDescription
            activityType="breathingExercises"
            activityData={activityDataByLimitationType as unknown as GeneratedSingleScheduleDto}
            activityLevel={
              customActivityData[limitationType]
                .breathingExercisesLevel as unknown as GenerateSchedulesDtoRecommendedLevel
            }
            limitationType={limitationType}
          />
          <ActivityDescription
            activityType="cognitiveGames"
            activityData={activityDataByLimitationType as unknown as GeneratedSingleScheduleDto}
            activityLevel={GenerateSchedulesDtoRecommendedLevel.moderate}
            limitationType={limitationType}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button type="default" onClick={toggleModal} className={styles.editButton}>
          {t('shared_btn_edit')}
        </Button>
        <Button type="primary" onClick={onConfirm} loading={isLoading}>
          {t('admin_btn_confirm_schedule')}
        </Button>
      </div>
    </Modal>
  );
};

export default CustomScheduleDetailsModal;
