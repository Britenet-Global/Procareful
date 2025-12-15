import { Button, Modal, type ModalProps } from 'antd';
import { type ButtonType } from 'antd/es/button';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { useStyles } from './styles';

type PromptModalProps = ModalProps & {
  type?: 'warning' | 'success' | 'info' | 'default';
  onConfirm?: () => void;
  notificationContent?: {
    header?: string;
    description?: string;
  };
  showCancelButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  confirmButtonType?: ButtonType;
  confirmButtonDisabled?: boolean;
  confirmButtonDanger?: boolean;
  isLoading?: boolean;
};

const PromptModal = ({
  onCancel,
  onConfirm,
  className,
  type = 'default',
  notificationContent,
  maskClosable = false,
  showCancelButton = true,
  cancelButtonText,
  confirmButtonText,
  confirmButtonDisabled = false,
  confirmButtonType,
  confirmButtonDanger = false,
  isLoading = false,
  children,
  ...restProps
}: PromptModalProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  const finalCancelButtonText = cancelButtonText ?? t('shared_btn_cancel');
  const finalSubmitButtonText = confirmButtonText ?? t('admin_btn_confirm');

  const { header, description } = notificationContent || {};

  return (
    <Modal
      centered
      onCancel={onCancel}
      maskClosable={maskClosable}
      keyboard={false}
      footer={null}
      className={className}
      {...restProps}
    >
      {notificationContent && (
        <div
          className={cx(styles.container, styles[type], {
            [styles.verticallyCentered]: !header || !description,
            [styles.alignTop]: type === 'info',
          })}
        >
          {type === 'warning' && <ErrorIcon className={cx(styles.icon, styles.iconWarning)} />}
          {type === 'success' && (
            <CheckCircleIcon className={cx(styles.icon, styles.iconSuccess)} />
          )}
          {type === 'info' && <InfoIcon className={cx(styles.icon, styles.iconInfo)} />}
          <div className={styles.textContainer}>
            {header && (
              <Title level={6} className={styles.header}>
                {header}
              </Title>
            )}
            {description && <Text>{description}</Text>}
          </div>
        </div>
      )}
      {children}
      <div className={styles.buttonContainer}>
        {showCancelButton && (
          <Button onClick={onCancel} className={styles.cancelButton}>
            {finalCancelButtonText}
          </Button>
        )}
        {onConfirm && (
          <Button
            onClick={onConfirm}
            type={confirmButtonType}
            disabled={confirmButtonDisabled}
            danger={type === 'warning' || confirmButtonDanger}
            loading={isLoading}
          >
            {finalSubmitButtonText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default PromptModal;
