import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Form, Select } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import {
  useSeniorAssessmentStore,
  type QualityOfLifeData,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { qualityOfLifeSchema } from '@ProcarefulAdmin/utils';
import { formatNumbersOnly, useTypedTranslation } from '@Procareful/common/lib';
import { MaskedInput, Paragraph, Title } from '@Procareful/ui';
import CardTitle from '../CardTitle';
import FormButtons from '../FormButtons';
import {
  anxietyDepressionOptions,
  mobilityOptions,
  motivationOptions,
  painDiscomfortOptions,
  selfCareOptions,
  usualActivitiesOptions,
} from './constants';
import { useStyles } from './styles';

const QualityOfLife = () => {
  const { t } = useTypedTranslation();
  const stylish = useStylish();
  const { styles, cx } = useStyles();

  const { goToNextStep, formDetails, setSeniorAssessmentDetails } = useSeniorAssessmentStore(
    state => ({
      goToNextStep: state.goToNextStep,
      formDetails: state.formDetails,
      setSeniorAssessmentDetails: state.setSeniorAssessmentDetails,
    })
  );

  const { control, handleSubmit } = useForm<QualityOfLifeData>({
    resolver: zodResolver(qualityOfLifeSchema),
    defaultValues: formDetails,
  });

  const formItemCommonProps = {
    control,
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
    labelCol: { span: 7 },
  };

  const onSubmit: SubmitHandler<QualityOfLifeData> = formData => {
    setSeniorAssessmentDetails(formData);
    goToNextStep();
  };

  return (
    <div className={stylish.container}>
      <Form layout="horizontal" onFinish={handleSubmit(onSubmit)} className={styles.form}>
        <StyledCard
          title={<CardTitle>{t('admin_title_motivation')}</CardTitle>}
          subtitle={t('admin_inf_quality_of_life_motivation_description')}
          className={styles.motivationCard}
        >
          <FormItem name="motivation" control={control}>
            <Select
              options={motivationOptions}
              placeholder={t('admin_form_select')}
              className={styles.motivationSelect}
            />
          </FormItem>
        </StyledCard>
        <StyledCard
          title={<CardTitle>{t('admin_title_stepper_quality_of_life')}</CardTitle>}
          subtitle={t('admin_inf_quality_of_life_subtitle')}
          className={cx(stylish.cardContainer, styles.cardWithBiggerMargin)}
        >
          <div className={styles.qualityOfLifeInputsContainer}>
            <FormItem
              label={t('admin_form_mobility')}
              name="mobility"
              tooltip={t('admin_inf_tooltip_mobility')}
              {...formItemCommonProps}
            >
              <Select options={mobilityOptions} placeholder={t('admin_form_select')} />
            </FormItem>
            <FormItem
              label={t('admin_form_selfCare')}
              name="selfCare"
              tooltip={t('admin_inf_tooltip_self_care')}
              {...formItemCommonProps}
            >
              <Select options={selfCareOptions} placeholder={t('admin_form_select')} />
            </FormItem>
            <FormItem
              label={t('admin_form_usual_activities')}
              name="usualActivities"
              tooltip={t('admin_inf_tooltip_usual_activities')}
              {...formItemCommonProps}
            >
              <Select options={usualActivitiesOptions} placeholder={t('admin_form_select')} />
            </FormItem>
            <FormItem
              label={t('admin_form_pain_discomfort')}
              name="painDiscomfort"
              tooltip={t('admin_inf_tooltip_pain_discomfort')}
              {...formItemCommonProps}
            >
              <Select options={painDiscomfortOptions} placeholder={t('admin_form_select')} />
            </FormItem>
            <FormItem
              label={t('admin_form_anxiety_depression')}
              name="anxietyDepression"
              tooltip={t('admin_inf_tooltip_anxiety_depression')}
              {...formItemCommonProps}
            >
              <Select options={anxietyDepressionOptions} placeholder={t('admin_form_select')} />
            </FormItem>
            <div className={styles.generalHealthContainer}>
              <Title level={6} className={styles.formTitle}>
                {t('admin_title_general_health')}
              </Title>
              <Paragraph>{t('admin_inf_general_subtitle')}</Paragraph>
              <FormItem
                label={t('admin_form_senior_health_today')}
                name="generalHealth"
                {...formItemCommonProps}
              >
                <MaskedInput
                  placeholder="0-100"
                  maskFunction={val => formatNumbersOnly(val, true)}
                />
              </FormItem>
            </div>
          </div>
        </StyledCard>
      </Form>
      <FormButtons onConfirm={handleSubmit(onSubmit)} />
      <NavigationBlockerModal shouldBlock />
    </div>
  );
};

export default QualityOfLife;
