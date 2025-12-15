import { useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import { CarePlanEditParams, PathRoutes } from '@ProcarefulAdmin/constants';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type ConfirmCarePlanUpdateModalProps = {
  isVisible: boolean;
  toggleModal: () => void;
};

const ConfirmCarePlanUpdateModal = ({
  isVisible,
  toggleModal,
}: ConfirmCarePlanUpdateModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seniorId = searchParams.get(SearchParams.Id);
  const isSeniorConditionChangedStep =
    searchParams.get(SearchParams.Step) === CarePlanEditParams.SeniorConditionChanged;
  const modalTitle = isSeniorConditionChangedStep
    ? t('admin_inf_seniors_condition_has_changed')
    : t('admin_title_care_plan_update');
  const modalDescription = isSeniorConditionChangedStep
    ? t('admin_inf_recommended_performing_condition_assessment')
    : t('admin_inf_care_plan_update');

  const handleRedirectPath = (type: 'activities' | 'assessment') => () => {
    if (!seniorId) {
      return;
    }

    const pathname =
      type === 'assessment' ? PathRoutes.SeniorAddEntry : PathRoutes.SeniorEditProfileEditSchedule;

    navigate(
      {
        pathname,
        search: new URLSearchParams({
          [SearchParams.Id]: seniorId,
        }).toString(),
      },
      { replace: true }
    );
  };

  return (
    <Modal
      title={modalTitle}
      centered
      maskClosable={false}
      open={isVisible}
      className={styles.modal}
      footer={null}
      onCancel={toggleModal}
      keyboard={false}
    >
      <Text>{modalDescription}</Text>
      {isSeniorConditionChangedStep && (
        <Text className={styles.marginTop}>{t('admin_inf_would_you_like_perform_assessment')}</Text>
      )}
      <FormControls
        confirmButtonText={t('admin_btn_perform_assessment')}
        resetButtonText={t('admin_btn_adjust_activities_only')}
        onReset={handleRedirectPath('activities')}
        onSubmit={handleRedirectPath('assessment')}
      />
    </Modal>
  );
};

export default ConfirmCarePlanUpdateModal;
