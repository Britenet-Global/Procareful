import { Button } from 'antd';
import { type ButtonHTMLType } from 'antd/es/button';
import { i18n } from '@Procareful/common/i18n';
import { useStyles } from './styles';

export type FormControlsProps = {
  onReset?: () => void;
  onSubmit?: () => void;
  onGoBack?: () => void;
  loading?: boolean;
  disabled?: boolean;
  isConfirmDisabled?: boolean;
  confirmButtonText?: string;
  resetButtonText?: string;
  goBackButtonText?: string;
  buttonClassName?: string;
  containerClassName?: string;
  confirmButtonHtmlType?: ButtonHTMLType;
  danger?: boolean;
};

const FormControls = ({
  onSubmit,
  onReset,
  onGoBack,
  disabled,
  isConfirmDisabled,
  resetButtonText = i18n.t('admin_btn_reset_changes'),
  confirmButtonText = i18n.t('shared_btn_save_changes'),
  goBackButtonText = i18n.t('admin_btn_back'),
  loading = false,
  buttonClassName,
  containerClassName,
  confirmButtonHtmlType,
  danger = false,
}: FormControlsProps) => {
  const { styles, cx } = useStyles();
  const buttonHtmlType = onSubmit ? 'button' : 'submit';

  return (
    <div className={cx(styles.container, containerClassName)}>
      {onGoBack && (
        <Button
          onClick={() => onGoBack()}
          className={cx(styles.resetButton, buttonClassName)}
          disabled={disabled}
        >
          {goBackButtonText}
        </Button>
      )}
      <div>
        {onReset && (
          <Button
            onClick={() => onReset()}
            className={cx(styles.resetButton, buttonClassName)}
            disabled={disabled}
          >
            {resetButtonText}
          </Button>
        )}
        <Button
          type="primary"
          onClick={onSubmit}
          htmlType={confirmButtonHtmlType || buttonHtmlType}
          disabled={isConfirmDisabled || disabled}
          loading={loading}
          className={buttonClassName}
          danger={danger}
        >
          {confirmButtonText}
        </Button>
      </div>
    </div>
  );
};

export default FormControls;
