import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Checkbox, Form, Select } from 'antd';
import { type CheckboxChangeEvent } from 'antd/es/checkbox';
import { type FormLabelAlign } from 'antd/es/form/interface';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import {
  type NoPhysicalIssuesData,
  useSeniorAssessmentStore,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { physicalAbilitiesNoIssuesSchema } from '@ProcarefulAdmin/utils';
import { formatNumbersOnly, useTypedTranslation } from '@Procareful/common/lib';
import { MaskedInput } from '@Procareful/ui';
import CardTitle from '../../CardTitle';
import FormButtons from '../../FormButtons';
import { useStyles } from '../styles';
import { numberOfDaysOptions } from './constants';

const NoPhysicalIssuesForm = () => {
  const { t } = useTypedTranslation();
  const stylish = useStylish();
  const { styles } = useStyles();

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
    resetField,
    watch,
    formState: { errors },
  } = useForm<NoPhysicalIssuesData>({
    resolver: zodResolver(physicalAbilitiesNoIssuesSchema),
    defaultValues: formDetails,
  });

  const vigorousActivityMinutesPerDayNotSureCurrentValue = watch(
    'vigorousActivityMinutesPerDayNotSure'
  );
  const moderateActivityMinutesPerDayNotSureCurrentValue = watch(
    'moderateActivityMinutesPerDayNotSure'
  );
  const walkingMinutesPerDayNotSureCurrentValue = watch('walkingMinutesPerDayNotSure');
  const timeSittingLastWeekNotSureCurrentValue = watch('timeSittingLastWeekNotSure');
  const vigorousActivityDaysLastWeek = watch('vigorousActivityDaysLastWeek');
  const moderateActivityDaysLastWeek = watch('moderateActivityDaysLastWeek');
  const walkingDaysLastWeek = watch('walkingDaysLastWeek');

  const hasNoVigorousActivityDays = vigorousActivityDaysLastWeek === 0;
  const hasNoModerateActivityDays = moderateActivityDaysLastWeek === 0;
  const hasNoWalkingDays = walkingDaysLastWeek === 0;

  const formItemCommonProps = {
    control,
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const handleResetFieldsAfterCheckboxChange = (
    event: CheckboxChangeEvent,
    fieldName: keyof NoPhysicalIssuesData
  ) => {
    if (!event.target.checked) {
      return;
    }

    resetField(fieldName);
  };

  const handleResetFieldsAfterSelectChange = (
    value: number,
    fieldNames: (keyof NoPhysicalIssuesData)[]
  ) => {
    if (value !== 0) {
      return;
    }

    fieldNames.forEach(fieldName => resetField(fieldName));
  };

  const onSubmit: SubmitHandler<NoPhysicalIssuesData> = formData => {
    setSeniorAssessmentDetails(formData);
    goToNextStep();
  };

  return (
    <div className={stylish.container}>
      <StyledCard
        title={<CardTitle>{t('admin_title_stepper_physical_activity_level')}</CardTitle>}
        subtitle={t('admin_inf_physical_activity_level_subtitle')}
        className={stylish.cardContainer}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={stylish.form}>
          <ol>
            <li>
              <Form.Item
                label={t('admin_form_vigorous_activity_days_last_week')}
                hasFeedback
                validateStatus={errors.vigorousActivityDaysLastWeek?.message && 'error'}
                help={errors.vigorousActivityDaysLastWeek?.message}
              >
                <Controller
                  control={control}
                  name="vigorousActivityDaysLastWeek"
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      onChange={selectedValue => {
                        handleResetFieldsAfterSelectChange(selectedValue, [
                          'vigorousActivityMinutesPerDay',
                          'vigorousActivityMinutesPerDayNotSure',
                        ]);
                        onChange(selectedValue);
                      }}
                      value={value}
                      ref={ref}
                      options={numberOfDaysOptions}
                      placeholder={t('admin_form_select_number_of_days')}
                      className={styles.input}
                    />
                  )}
                />
              </Form.Item>
            </li>
            <li>
              <div className={styles.inputContainerWithCheckbox}>
                <FormItem
                  label={t('admin_form_vigorous_activity_minutes_per_day')}
                  name="vigorousActivityMinutesPerDay"
                  {...formItemCommonProps}
                >
                  <MaskedInput
                    placeholder={t('admin_form_minutes_per_day')}
                    className={styles.input}
                    disabled={
                      hasNoVigorousActivityDays || vigorousActivityMinutesPerDayNotSureCurrentValue
                    }
                    maskFunction={formatNumbersOnly}
                  />
                </FormItem>
                <Controller
                  control={control}
                  name="vigorousActivityMinutesPerDayNotSure"
                  render={({ field: { onChange, value, ref } }) => (
                    <Checkbox
                      onChange={e => {
                        handleResetFieldsAfterCheckboxChange(e, 'vigorousActivityMinutesPerDay');
                        onChange(e);
                      }}
                      checked={value}
                      ref={ref}
                      disabled={hasNoVigorousActivityDays}
                    >
                      {t('admin_form_dont_know_not_sure')}
                    </Checkbox>
                  )}
                />
              </div>
            </li>
            <li>
              <Form.Item
                label={t('admin_form_moderate_activity_days_last_week')}
                hasFeedback
                validateStatus={errors.moderateActivityDaysLastWeek?.message && 'error'}
                help={errors.moderateActivityDaysLastWeek?.message}
              >
                <Controller
                  control={control}
                  name="moderateActivityDaysLastWeek"
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      onChange={selectedValue => {
                        handleResetFieldsAfterSelectChange(selectedValue, [
                          'moderateActivityMinutesPerDay',
                          'moderateActivityMinutesPerDayNotSure',
                        ]);
                        onChange(selectedValue);
                      }}
                      value={value}
                      ref={ref}
                      options={numberOfDaysOptions}
                      placeholder={t('admin_form_select_number_of_days')}
                      className={styles.input}
                    />
                  )}
                />
              </Form.Item>
            </li>
            <li>
              <div className={styles.inputContainerWithCheckbox}>
                <FormItem
                  label={t('admin_form_moderate_activity_minutes_per_day')}
                  name="moderateActivityMinutesPerDay"
                  {...formItemCommonProps}
                >
                  <MaskedInput
                    placeholder={t('admin_form_minutes_per_day')}
                    className={styles.input}
                    maskFunction={formatNumbersOnly}
                    disabled={
                      hasNoModerateActivityDays || moderateActivityMinutesPerDayNotSureCurrentValue
                    }
                  />
                </FormItem>
                <Controller
                  control={control}
                  name="moderateActivityMinutesPerDayNotSure"
                  render={({ field: { onChange, value, ref } }) => (
                    <Checkbox
                      onChange={e => {
                        handleResetFieldsAfterCheckboxChange(e, 'moderateActivityMinutesPerDay');
                        onChange(e);
                      }}
                      checked={value}
                      ref={ref}
                      disabled={hasNoModerateActivityDays}
                    >
                      {t('admin_form_dont_know_not_sure')}
                    </Checkbox>
                  )}
                />
              </div>
            </li>
            <li>
              <Form.Item
                label={t('admin_form_walking_days_last_week')}
                hasFeedback
                validateStatus={errors.walkingDaysLastWeek?.message && 'error'}
                help={errors.walkingDaysLastWeek?.message}
              >
                <Controller
                  control={control}
                  name="walkingDaysLastWeek"
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      onChange={selectedValue => {
                        handleResetFieldsAfterSelectChange(selectedValue, [
                          'walkingMinutesPerDay',
                          'walkingMinutesPerDayNotSure',
                        ]);
                        onChange(selectedValue);
                      }}
                      value={value}
                      ref={ref}
                      options={numberOfDaysOptions}
                      placeholder={t('admin_form_select_number_of_days')}
                      className={styles.input}
                    />
                  )}
                />
              </Form.Item>
            </li>
            <li>
              <div className={styles.inputContainerWithCheckbox}>
                <FormItem
                  label={t('admin_form_walking_minutes_per_day')}
                  name="walkingMinutesPerDay"
                  {...formItemCommonProps}
                >
                  <MaskedInput
                    placeholder={t('admin_form_minutes_per_day')}
                    className={styles.input}
                    maskFunction={formatNumbersOnly}
                    disabled={hasNoWalkingDays || walkingMinutesPerDayNotSureCurrentValue}
                  />
                </FormItem>
                <Controller
                  control={control}
                  name="walkingMinutesPerDayNotSure"
                  render={({ field: { onChange, value, ref } }) => (
                    <Checkbox
                      onChange={e => {
                        handleResetFieldsAfterCheckboxChange(e, 'walkingMinutesPerDay');
                        onChange(e);
                      }}
                      checked={value}
                      ref={ref}
                      disabled={hasNoWalkingDays}
                    >
                      {t('admin_form_dont_know_not_sure')}
                    </Checkbox>
                  )}
                />
              </div>
            </li>
            <li>
              <div className={styles.inputContainerWithCheckbox}>
                <FormItem
                  label={t('admin_form_time_sitting_last_week')}
                  name="timeSittingLastWeek"
                  disabled={timeSittingLastWeekNotSureCurrentValue}
                  {...formItemCommonProps}
                >
                  <MaskedInput
                    placeholder={t('admin_form_minutes_per_day')}
                    className={styles.input}
                    maskFunction={formatNumbersOnly}
                  />
                </FormItem>
                <Controller
                  control={control}
                  name="timeSittingLastWeekNotSure"
                  render={({ field: { onChange, value, ref } }) => (
                    <Checkbox
                      onChange={e => {
                        handleResetFieldsAfterCheckboxChange(e, 'timeSittingLastWeek');
                        onChange(e);
                      }}
                      checked={value}
                      ref={ref}
                    >
                      {t('admin_form_dont_know_not_sure')}
                    </Checkbox>
                  )}
                />
              </div>
            </li>
          </ol>
        </Form>
      </StyledCard>
      <FormButtons
        onConfirm={handleSubmit(onSubmit)}
        onBack={() => setShowExtendedPhysicalActivityForm(false)}
        containerClassName={stylish.formButtonContainer}
      />
      <NavigationBlockerModal shouldBlock />
    </div>
  );
};

export default memo(NoPhysicalIssuesForm);
