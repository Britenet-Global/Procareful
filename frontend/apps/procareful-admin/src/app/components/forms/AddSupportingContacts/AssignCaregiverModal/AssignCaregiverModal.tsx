import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import type { SupportingContactUserModalData } from '@ProcarefulAdmin/typings';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph } from '@Procareful/ui';
import ContactData from '../ContactData';

type AssignCaregiverModalProps = {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userData: SupportingContactUserModalData;
};

const AssignCaregiverModal = ({
  open,
  loading,
  onConfirm,
  onCancel,
  userData,
}: AssignCaregiverModalProps) => {
  const { t } = useTypedTranslation();

  return (
    <PromptModal
      title={t('admin_alert_assign_informal_caregiver_title')}
      open={open}
      type="warning"
      notificationContent={{
        header: t('admin_title_warning'),
        description: t('admin_alert_assign_informal_caregiver_subtitle'),
      }}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmButtonText={t('admin_btn_assign_informal_caregiver')}
      cancelButtonText={t('shared_btn_edit')}
      confirmButtonType="primary"
      isLoading={loading}
    >
      <ContactData {...userData} />
      <Paragraph>{t('admin_alert_assign_informal_caregiver_confirmation')}</Paragraph>
    </PromptModal>
  );
};

export default AssignCaregiverModal;
