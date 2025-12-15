import { useEffect } from 'react';
import { Steps } from 'antd';
import { useSeniorAssessmentStore } from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { seniorConditionSteps } from './constants';
import { useStyles } from './styles';

const AddSeniorAssessment = () => {
  const { styles } = useStyles();
  const { currentStep, resetStore } = useSeniorAssessmentStore(state => ({
    currentStep: state.currentStep,
    resetStore: state.resetStore,
  }));

  useEffect(
    () => () => resetStore(),

    [resetStore]
  );

  return (
    <div className={styles.container}>
      <Steps
        size="small"
        current={currentStep}
        items={seniorConditionSteps}
        className={styles.stepper}
      />
      {seniorConditionSteps?.[currentStep].content}
    </div>
  );
};

export default AddSeniorAssessment;
