import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import type { SupportingContactUserModalData } from '@ProcarefulAdmin/typings';
import { useTypedTranslation } from '@Procareful/common/lib';
import ContactData from '../ContactData';

type RemoveContactModalProps = {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userData: SupportingContactUserModalData;
};

const RemoveContactModal = ({
  open,
  loading,
  onConfirm,
  onCancel,
  userData,
}: RemoveContactModalProps) => {
  const { t } = useTypedTranslation();

  return (
    <PromptModal
      title={t('admin_title_are_you_sure_you_want_to_remove')}
      open={open}
      type="success"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmButtonText={t('admin_btn_remove')}
      cancelButtonText={t('shared_btn_edit')}
      confirmButtonType="primary"
      confirmButtonDanger
      isLoading={loading}
    >
      <ContactData {...userData} />
    </PromptModal>
  );
};

export default RemoveContactModal;
