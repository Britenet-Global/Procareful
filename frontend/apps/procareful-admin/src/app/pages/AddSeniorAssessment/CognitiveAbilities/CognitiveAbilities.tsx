import { zodResolver } from '@hookform/resolvers/zod';
import isNumber from 'lodash/isNumber';
import { memo } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Link } from 'react-router-dom';
import { Form } from 'antd';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import {
  type CognitiveAbilitiesData,
  useSeniorAssessmentStore,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { cognitiveAbilitiesSchema } from '@ProcarefulAdmin/utils';
import { formatNumbersOnly, useTypedTranslation } from '@Procareful/common/lib';
import { MaskedInput } from '@Procareful/ui';
import CardTitle from '../CardTitle';
import FormButtons from '../FormButtons';
import { useStyles } from './styles';

const CognitiveAbilities = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  const { formDetails, setSeniorAssessmentDetails, goToNextStep } = useSeniorAssessmentStore(
    state => ({
      formDetails: state.formDetails,
      setSeniorAssessmentDetails: state.setSeniorAssessmentDetails,
      goToNextStep: state.goToNextStep,
    })
  );

  const { control, handleSubmit, watch } = useForm<CognitiveAbilitiesData>({
    resolver: zodResolver(cognitiveAbilitiesSchema),
    defaultValues: { mocaScoring: formDetails.mocaScoring },
  });

  const mocaScoring = watch('mocaScoring');

  const onSubmit: SubmitHandler<CognitiveAbilitiesData> = ({ mocaScoring }) => {
    setSeniorAssessmentDetails({ mocaScoring });
    goToNextStep();
  };

  return (
    <>
      <StyledCard
        title={<CardTitle>{t('admin_title_stepper_cognitive_abilities')}</CardTitle>}
        subtitle={t('admin_inf_cognitive_abilities_subtitle')}
        className={styles.cardContainer}
      >
        <Link className={styles.getMocaButton} to={PathRoutes.Support}>
          {t('admin_btn_get_printable_moca_questionnaire')}
        </Link>
        <Form>
          <FormItem
            tooltip={t('admin_inf_cognitive_abilities_moca_tooltip')}
            control={control}
            label={t('admin_form_moca_scoring')}
            name="mocaScoring"
            labelAlign="left"
            hasFeedback
          >
            <MaskedInput
              className={styles.scoreInput}
              maskFunction={value => formatNumbersOnly(value, true)}
            />
          </FormItem>
        </Form>
      </StyledCard>
      <FormButtons onConfirm={handleSubmit(onSubmit)} />
      <NavigationBlockerModal
        shouldBlock={isNumber(formDetails?.mocaScoring) || isNumber(mocaScoring)}
      />
    </>
  );
};

export default memo(CognitiveAbilities);
