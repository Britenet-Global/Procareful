import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Button, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import DeleteUserModal from '@ProcarefulAdmin/components/UserStatus/DeleteUserModal';
import { statusValueToDisplay } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import type { AdminRoles, UserStatus as UserStatusType } from '@ProcarefulAdmin/typings';
import { StatusStatusName } from '@Procareful/common/api';
import {
  type Key,
  capitalizeFirstLetter,
  useToggle,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { Paragraph, Title, Text } from '@Procareful/ui';
import PromptModal from '../PromptModal';
import { getModalConfigForRoles, getStatusConfig } from './helpers';
import { useStyles } from './styles';

export type UserDetails = {
  name: string;
  roles?: AdminRoles;
  status: UserStatusType;
};

type UserStatusProps = {
  userDetails: UserDetails;
  onDeactivationConfirm: () => void;
  onDeletionConfirm: () => void;
  onActivate: () => void;
  loading: boolean;
  onDeactivate?: () => void;
};

const UserStatus = ({
  userDetails,
  onDeactivate,
  onDeactivationConfirm,
  onDeletionConfirm,
  onActivate,
  loading,
}: UserStatusProps) => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const { status, name, roles } = userDetails || {};
  const { control, reset } = useForm({
    defaultValues: { status: capitalizeFirstLetter(status) },
  });
  const [isDeactivationModalVisible, toggleDeactivationModalVisibility] = useToggle(false);
  const [isDeletionModalVisible, toggleDeletionModalVisibility] = useToggle(false);
  const { buttonText, danger, deleteButtonText, title, subtitle, deleteButtonType } =
    getStatusConfig(status, roles);
  const {
    deactivateModalTitle,
    deactivateModalNotificationTitle,
    deactivateModalNotificationSubtitle,
    deactivateModalFooter,
  } = getModalConfigForRoles(roles);
  const isActiveStatus = status === StatusStatusName.active;
  const isInactiveStatus = status === StatusStatusName.inactive;
  const isStatusInactiveOrCreated = isInactiveStatus || status === StatusStatusName.created;
  const isStatusActiveOrInactive = isInactiveStatus || isActiveStatus;

  const handleUserDeactivation = () => {
    toggleDeactivationModalVisibility();
    onDeactivationConfirm();
  };

  const handleUserDeletion = () => {
    toggleDeletionModalVisibility();
    onDeletionConfirm();
  };

  const handleButtonClick = () => {
    if (isActiveStatus) {
      if (onDeactivate) {
        onDeactivate();

        return;
      }
      toggleDeactivationModalVisibility();
    }
    if (isInactiveStatus) {
      onActivate();
    }
  };

  useEffect(() => {
    if (status) {
      reset({ status: t(statusValueToDisplay[status] as Key) });
    }
  }, [status, reset, t]);

  return (
    <>
      <div className={styles.container}>
        <FormItem
          name="status"
          control={control}
          label={t('admin_form_status')}
          wrapperCol={{ span: 8 }}
          className={stylish.input}
          labelCol={{ span: 6 }}
          labelAlign={'left' as FormLabelAlign}
        >
          <Input readOnly disabled />
        </FormItem>
        <div className={styles.textContainer}>
          <Title level={6} className={styles.actionTitle}>
            {title}
          </Title>
          <Paragraph>{subtitle}</Paragraph>
        </div>
        <div className={styles.buttonContainer}>
          {isStatusActiveOrInactive && (
            <Button type="default" danger={danger} onClick={handleButtonClick}>
              {buttonText}
            </Button>
          )}
          {isStatusInactiveOrCreated && (
            <Button type={deleteButtonType} danger onClick={toggleDeletionModalVisibility}>
              {deleteButtonText}
            </Button>
          )}
        </div>
      </div>
      <PromptModal
        type="warning"
        open={isDeactivationModalVisible}
        title={deactivateModalTitle}
        notificationContent={{
          header: deactivateModalNotificationTitle,
          description: deactivateModalNotificationSubtitle,
        }}
        confirmButtonType="primary"
        confirmButtonText={t('admin_btn_deactivate')}
        onConfirm={handleUserDeactivation}
        onCancel={toggleDeactivationModalVisibility}
        closable
      >
        <div className={styles.modalTextContainer}>
          <Text>{deactivateModalFooter}</Text>
          <Text strong>{name}</Text>
        </div>
      </PromptModal>
      <DeleteUserModal
        userDetails={{ roles, name }}
        open={isDeletionModalVisible}
        onCancel={toggleDeletionModalVisibility}
        onDeletionConfirm={handleUserDeletion}
        loading={loading}
      />
    </>
  );
};

export default UserStatus;
