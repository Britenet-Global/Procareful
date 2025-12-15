import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import FormControls, { type FormControlsProps } from '@ProcarefulAdmin/components/FormControls';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useSeniorAssessmentStore } from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useTypedTranslation } from '@Procareful/common/lib';
import { useStyles } from './styles';

type FormButtonsProps = FormControlsProps & {
  onConfirm?: () => void;
  onBack?: () => void;
  containerClassName?: string;
};

const FormButtons = ({
  onConfirm,
  onBack,
  containerClassName,
  confirmButtonText,
  resetButtonText,
  ...otherProps
}: FormButtonsProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const { currentStep, goToPreviousStep } = useSeniorAssessmentStore(state => ({
    currentStep: state.currentStep,
    goToPreviousStep: state.goToPreviousStep,
  }));

  const handleGoBack = () => {
    if (onBack) {
      onBack();

      return;
    }

    goToPreviousStep();
  };

  const isFirstStep = currentStep === 0;

  return (
    <div
      className={cx(
        styles.container,
        { [styles.twoButtonContainer]: isFirstStep },
        containerClassName
      )}
    >
      {!isFirstStep && <Button onClick={handleGoBack}>{t('admin_btn_back')}</Button>}
      <FormControls
        buttonClassName={styles.button}
        onSubmit={onConfirm}
        onReset={() => navigate(PathRoutes.Seniors)}
        resetButtonText={resetButtonText ?? t('shared_btn_cancel')}
        confirmButtonText={confirmButtonText ?? t('admin_btn_next_step')}
        {...otherProps}
      />
    </div>
  );
};

export default FormButtons;
