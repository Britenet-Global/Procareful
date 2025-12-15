import { useState } from 'react';
import { Input } from 'antd';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import type { RoleDto } from '@Procareful/common/api';
import { Text } from '@Procareful/ui';
import { type UserDetails } from '../UserStatus';
import {
  getInitialModalConfigForRoles,
  getFinalModalConfigForRoles,
  normalizeQuotes,
  getProperPlaceholder,
} from './helpers';
import { useStyles } from './styles';

type DeleteUserModalProps = {
  userDetails: Omit<UserDetails, 'status'>;
  open: boolean;
  onDeletionConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
};

const DeleteUserModal = ({
  userDetails,
  open,
  onCancel,
  onDeletionConfirm,
  loading,
}: DeleteUserModalProps) => {
  const { styles } = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [isUserDeletionConfirmed, setIsUserDeletionConfirmed] = useState(false);
  const { name, roles } = userDetails;
  const isConfirmButtonDisabled =
    isUserDeletionConfirmed && normalizeQuotes(inputValue) !== normalizeQuotes(name);
  const {
    modalTitle,
    modalNotificationTitle,
    modalNotificationSubtitle,
    modalFooter,
    modalConfirmButtonText,
  } = (isUserDeletionConfirmed ? getFinalModalConfigForRoles : getInitialModalConfigForRoles)(
    roles as RoleDto[]
  );

  const handleDeleteUserConfirmation = () => {
    setIsUserDeletionConfirmed(true);

    if (isUserDeletionConfirmed) {
      setIsUserDeletionConfirmed(false);
      setInputValue('');
      onDeletionConfirm();
    }
  };

  const handleCancel = () => {
    setInputValue('');
    setIsUserDeletionConfirmed(false);
    onCancel();
  };

  return (
    <PromptModal
      closable
      open={open}
      title={modalTitle}
      notificationContent={{
        header: modalNotificationTitle,
        description: modalNotificationSubtitle,
      }}
      onConfirm={handleDeleteUserConfirmation}
      onCancel={handleCancel}
      type="warning"
      confirmButtonType="primary"
      confirmButtonText={modalConfirmButtonText}
      confirmButtonDisabled={isConfirmButtonDisabled}
      loading={loading}
    >
      <div className={styles.modalTextContainer}>
        <Text>{modalFooter}</Text>
        <Text strong>{name}</Text>
        {isUserDeletionConfirmed && (
          <Input
            placeholder={getProperPlaceholder(roles)}
            value={inputValue}
            onChange={event => setInputValue(event.target.value)}
          />
        )}
      </div>
    </PromptModal>
  );
};

export default DeleteUserModal;
