import { Paragraph } from '@Procareful/ui';
import { Button, Modal } from 'antd';
import { useStyles } from './styles';

type ConfirmationModalProps = {
  title: string;
  description?: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  open: boolean;
  loading?: boolean;
};

const ConfirmationModal = ({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  open,
  loading = false,
}: ConfirmationModalProps) => {
  const { styles } = useStyles();

  return (
    <Modal
      open={open}
      title={title}
      centered
      wrapClassName={styles.container}
      footer={false}
      closable={false}
      keyboard={false}
      maskClosable={false}
    >
      {description && (
        <div className={styles.contentContainer}>
          <Paragraph>{description}</Paragraph>
        </div>
      )}
      <div className={styles.footerContainer}>
        <Button type="primary" onClick={onConfirm} size="large" loading={loading}>
          {confirmText}
        </Button>
        {cancelText && (
          <Button type="default" onClick={onCancel} size="large">
            {cancelText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
