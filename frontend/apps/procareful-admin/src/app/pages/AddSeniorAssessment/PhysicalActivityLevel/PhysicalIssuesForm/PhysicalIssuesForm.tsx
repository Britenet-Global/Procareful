import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Form, Radio } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import {
  useSeniorAssessmentStore,
  type PhysicalActivityLevelData,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { physicalAbilitiesSchema } from '@ProcarefulAdmin/utils';
import { useTypedTranslation } from '@Procareful/common/lib';
import CardTitle from '../../CardTitle';
import FormButtons from '../../FormButtons';

const PhysicalIssuesForm = () => {
  const { t } = useTypedTranslation();
  const stylish = useStylish();

  const {
    goToNextStep,
    formDetails,
    setSeniorAssessmentDetails,
    setShowExtendedPhysicalActivityForm,
  } = useSeniorAssessmentStore(state => ({
    goToNextStep: state.goToNextStep,
    formDetails: state.formDetails,
    setSeniorAssessmentDetails: state.setSeniorAssessmentDetails,
    setShowExtendedPhysicalActivityForm: state.setShowExtendedPhysicalActivityForm,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    watch,
    setValue,
  } = useForm<PhysicalActivityLevelData>({
    resolver: zodResolver(physicalAbilitiesSchema),
    defaultValues: formDetails,
  });

  const currentlyBedridden = watch('currentlyBedridden');

  const formItemCommonProps = {
    control,
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const handleCurrentlyBedriddenChange = (isBedridden: boolean) => {
    if (!isBedridden) {
      resetField('canWalkWithoutSupport', { keepTouched: false, defaultValue: undefined });
      resetField('severeBalanceProblems', { keepTouched: false, defaultValue: undefined });

      return;
    }

    setValue('canWalkWithoutSupport', !isBedridden);
    setValue('severeBalanceProblems', isBedridden);
  };

  const onSubmit: SubmitHandler<PhysicalActivityLevelData> = ({
    currentlyBedridden,
    canWalkWithoutSupport,
    severeBalanceProblems,
  }) => {
    setSeniorAssessmentDetails({
      currentlyBedridden,
      canWalkWithoutSupport,
      severeBalanceProblems,
    });

    if (currentlyBedridden || !canWalkWithoutSupport || severeBalanceProblems) {
      goToNextStep();

      return;
    }

    setShowExtendedPhysicalActivityForm(true);
  };

  return (
    <>
      <StyledCard
        title={<CardTitle>{t('admin_title_stepper_physical_activity_level')}</CardTitle>}
        subtitle={t('admin_inf_physical_activity_level_subtitle')}
        className={stylish.cardContainer}
      >
        <Form layout="vertical" className={stylish.form}>
          <ol>
            <li>
              {/* We need to use Form.Item from AntDesign because FormItem from react-hook-form-antd 
              doesn't allow us to add custom event handlers, which are necessary in this specific case */}
              <Form.Item
                label={t('admin_form_are_you_currently_bedridden')}
                hasFeedback
                validateStatus={errors.currentlyBedridden?.message && 'error'}
                help={errors.currentlyBedridden?.message}
                valuePropName="checked"
              >
                <Controller
                  control={control}
                  name="currentlyBedridden"
                  render={({ field: { onChange, value, ref } }) => (
                    <Radio.Group
                      value={value}
                      ref={ref}
                      onChange={e => {
                        onChange(e);
                        handleCurrentlyBedriddenChange(e.target.value);
                      }}
                    >
                      <div className={stylish.radioGroup}>
                        <Radio value={true}>{t('admin_btn_yes')}</Radio>
                        <Radio value={false}>{t('admin_btn_no')}</Radio>
                      </div>
                    </Radio.Group>
                  )}
                />
              </Form.Item>
            </li>
            <li>
              <FormItem
                label={t('admin_form_ability_to_walk')}
                name="canWalkWithoutSupport"
                {...formItemCommonProps}
              >
                <Radio.Group disabled={currentlyBedridden}>
                  <div className={stylish.radioGroup}>
                    <Radio value={true}>{t('admin_btn_yes')}</Radio>
                    <Radio value={false}>{t('admin_btn_no')}</Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
            <li>
              <FormItem
                label={t('admin_form_severe_balance_problems')}
                name="severeBalanceProblems"
                {...formItemCommonProps}
              >
                <Radio.Group disabled={currentlyBedridden}>
                  <div className={stylish.radioGroup}>
                    <Radio value={true}>{t('admin_btn_yes')}</Radio>
                    <Radio value={false}>{t('admin_btn_no')}</Radio>
                  </div>
                </Radio.Group>
              </FormItem>
            </li>
          </ol>
        </Form>
      </StyledCard>
      <FormButtons onConfirm={handleSubmit(onSubmit)} />
      <NavigationBlockerModal shouldBlock />
    </>
  );
};

export default PhysicalIssuesForm;
