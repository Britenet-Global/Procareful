import { useBlocker } from 'react-router-dom';
import { useTypedTranslation } from '@Procareful/common/lib';
import PromptModal from '../PromptModal';

type NavigationBlockerModalProps = {
  shouldBlock?: boolean;
};

const NavigationBlockerModal = ({ shouldBlock = false }: NavigationBlockerModalProps) => {
  const { t } = useTypedTranslation();

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (shouldBlock && currentLocation.pathname !== nextLocation.pathname) {
      return true;
    }

    return false;
  });

  const handleProceed = () => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  const handleCancel = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  return (
    <PromptModal
      type="default"
      title={t('admin_title_unsaved_changes')}
      open={blocker.state === 'blocked'}
      onConfirm={handleProceed}
      onCancel={handleCancel}
      notificationContent={{
        description: t('admin_inf_leave_page_confirmation'),
      }}
      cancelButtonText={t('admin_btn_back_to_editing')}
      confirmButtonText={t('admin_btn_discard_changes')}
      closable={false}
      maskClosable={false}
      keyboard={false}
      confirmButtonDanger
    />
  );
};

export default NavigationBlockerModal;
