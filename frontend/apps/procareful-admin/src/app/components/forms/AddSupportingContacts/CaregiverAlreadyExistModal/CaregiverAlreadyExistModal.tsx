import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import type { SupportingContactUserModalData } from '@ProcarefulAdmin/typings';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph } from '@Procareful/ui';
import ContactData from '../ContactData';
import { useStyles } from './styles';

type CaregiverAlreadyExistModalProps = {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userData: SupportingContactUserModalData;
};

const CaregiverAlreadyExistModal = ({
  open,
  loading,
  onConfirm,
  onCancel,
  userData,
}: CaregiverAlreadyExistModalProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <PromptModal
      title={t('admin_title_informal_caregiver_already_exists')}
      open={open}
      type="success"
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmButtonText={t('admin_btn_assign_informal_caregiver')}
      cancelButtonText={t('shared_btn_edit')}
      confirmButtonType="primary"
      isLoading={loading}
    >
      <div className={styles.container}>
        <Paragraph>{t('admin_inf_person_is_already_in_database')}</Paragraph>
        <ContactData {...userData} />
        <Paragraph>{t('admin_inf_assign_person_or_edit')}</Paragraph>
      </div>
    </PromptModal>
  );
};

export default CaregiverAlreadyExistModal;
