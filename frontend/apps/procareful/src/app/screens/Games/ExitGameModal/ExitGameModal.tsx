import { useTypedTranslation } from '@Procareful/common/lib';
import ConfirmationModal from '@ProcarefulApp/components/ConfirmationModal';

type ExitGameModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ExitGameModal = (props: ExitGameModalProps) => {
  const { t } = useTypedTranslation();

  return (
    <ConfirmationModal
      confirmText={t('senior_btn_back_to_game')}
      cancelText={t('senior_btn_end_game')}
      title={t('senior_title_exit_game')}
      {...props}
    />
  );
};

export default ExitGameModal;
