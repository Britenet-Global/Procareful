import { useSearchParams } from 'react-router-dom';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import { CarePlanEditParams } from '@ProcarefulAdmin/constants';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';

type CarePlanChangeInfoModalProps = {
  isVisible: boolean;
  toggleModal: () => void;
};

const CarePlanChangeInfoModal = ({ isVisible, toggleModal }: CarePlanChangeInfoModalProps) => {
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleEditButtonClick = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(SearchParams.Step, CarePlanEditParams.EditCarePlan);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <PromptModal
      closable
      open={isVisible}
      title={t('admin_title_care_plan_change_confirm')}
      notificationContent={{
        description: t('admin_inf_care_plan_change_confirm'),
      }}
      onConfirm={handleEditButtonClick}
      onCancel={toggleModal}
      type="info"
      confirmButtonType="primary"
      confirmButtonText={t('admin_title_edit_care_plan')}
    >
      <Text>{t('admin_inf_are_you_sure_you_want_to_edit_care_plan')}</Text>
    </PromptModal>
  );
};

export default CarePlanChangeInfoModal;
