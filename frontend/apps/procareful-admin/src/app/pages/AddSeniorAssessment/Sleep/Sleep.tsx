import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Select, Form, TimePicker } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import {
  type SleepAssessmentData,
  useSeniorAssessmentStore,
} from '@ProcarefulAdmin/store/seniorAssessmentStore';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { sleepAssessmentSchema } from '@ProcarefulAdmin/utils';
import { AddSleepAssessmentDtoHaveBedPartnerOrRoomMate } from '@Procareful/common/api';
import { formatNumbersOnly, useTypedTranslation, TimeFormat } from '@Procareful/common/lib';
import { Text, MaskedInput } from '@Procareful/ui';
import CardTitle from '../CardTitle';
import FormButtons from '../FormButtons';
import {
  cannotSleepWithin30MinutesOptions,
  wakeUpTimeOptions,
  needToUseBathroomOptions,
  cannotBreatheComfortablyOptions,
  coughOrSnoreLoudlyOptions,
  feelTooHotOptions,
  havePainOptions,
  hadBadDreamsOptions,
  sleepingTroubleFrequencyOptions,
  feelTooColdOptions,
  medicineForSleepOptions,
  troubleStayingAwakeWhileDrivingOptions,
  sleepQualityRatingOptions,
  enthusiasmToGetThingsDoneOptions,
  haveBedPartnerOrRoomMateOptions,
  loudSnoringOptions,
  breathingPauseOptions,
  legsTwitchingOptions,
  sleepDisorientationOptions,
  coughOrSnoreLoudlyRoomMateOptions,
  feelTooColdRoomMateOptions,
  feelTooHotRoomMateOptions,
  hadBadDreamsRoomMateOptions,
  havePainRoomMateOptions,
  otherRestlessNessFrequencyOptions,
} from './constants';
import { useStyles } from './styles';

const Sleep = () => {
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

  const {
    control,
    watch,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<SleepAssessmentData>({
    resolver: zodResolver(sleepAssessmentSchema),
    defaultValues: formDetails,
  });

  const haveBedPartnerOrRoomMate = watch('haveBedPartnerOrRoomMate');
  const otherReasonsForTroubleSleeping = watch('otherReasonsForTroubleSleeping');
  const otherRestlessness = watch('otherRestlessness');

  const shouldDisablePartnerQuestions =
    haveBedPartnerOrRoomMate ===
      AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.no_partner_or_roommate ||
    !haveBedPartnerOrRoomMate;

  const onSubmit: SubmitHandler<SleepAssessmentData> = formData => {
    setSeniorAssessmentDetails(formData);
    goToNextStep();
  };

  const handleHavePartnerChange = (
    value: AddSleepAssessmentDtoHaveBedPartnerOrRoomMate,
    onChange: (...event: AddSleepAssessmentDtoHaveBedPartnerOrRoomMate[]) => void
  ) => {
    if (value === AddSleepAssessmentDtoHaveBedPartnerOrRoomMate.no_partner_or_roommate || !value) {
      const fieldsToReset: Array<keyof SleepAssessmentData> = [
        'loudSnoring',
        'breathingPause',
        'legsTwitching',
        'sleepDisorientation',
        'coughOrSnoreLoudlyRoomMate',
        'feelTooColdRoomMate',
        'feelTooHotRoomMate',
        'hadBadDreamsRoomMate',
        'havePainRoomMate',
        'otherRestlessness',
        'otherRestlessnessFrequency',
      ];

      fieldsToReset.forEach(field => resetField(field, { defaultValue: undefined }));
    }

    onChange(value);
  };

  const handleChangeWithReset = (
    value: string,
    fieldNameToReset: keyof SleepAssessmentData,
    onChange: (...event: string[]) => void
  ) => {
    if (!value) {
      resetField(fieldNameToReset);
    }

    onChange(value);
  };

  return (
    <div className={styles.container}>
      <StyledCard
        title={<CardTitle>{t('admin_title_stepper_sleep_assessment')}</CardTitle>}
        subtitle={t('admin_inf_stepper_sleep_assessment_subtitle')}
        className={stylish.cardContainer}
      >
        <Form layout="horizontal" className={stylish.form}>
          <ol>
            <li>
              <FormItem
                hasFeedback
                name="bedTime"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_bed_time')}
                className={styles.verticalItem}
              >
                <TimePicker
                  format={TimeFormat.HH_MM}
                  placeholder={t('admin_form_select_time')}
                  className={styles.selectWidth}
                  showNow={false}
                />
              </FormItem>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="fallAsleepDuration"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_fall_asleep_duration')}
                className={styles.verticalItem}
              >
                <MaskedInput
                  placeholder={t('admin_form_minutes')}
                  maskFunction={formatNumbersOnly}
                  className={styles.selectWidth}
                />
              </FormItem>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="wakeUpTime"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_wake_up_time')}
                className={styles.verticalItem}
              >
                <TimePicker
                  format={TimeFormat.HH_MM}
                  placeholder={t('admin_form_select_time')}
                  className={styles.selectWidth}
                  showNow={false}
                />
              </FormItem>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="actualSleepHours"
                control={control}
                label={t('admin_form_actual_sleep_hours')}
                className={styles.verticalItem}
                labelCol={{ span: 24 }}
              >
                <MaskedInput
                  placeholder={t('admin_form_hours_of_sleep')}
                  maskFunction={formatNumbersOnly}
                  className={styles.selectWidth}
                />
              </FormItem>
            </li>
            <li>
              <div className={styles.troubleSleepingContainer}>
                <Text strong>{t('admin_form_trouble_sleeping_because')}</Text>
                <div className={styles.noStylesLabelContainer}>
                  <FormItem
                    label={t('admin_form_cannot_sleep_within_30_minutes')}
                    hasFeedback
                    name="cannotSleepWithin30Minutes"
                    control={control}
                  >
                    <Select
                      options={cannotSleepWithin30MinutesOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_wake_up_midnight_or_early_morning')}
                    hasFeedback
                    name="wakeUpMidnightOrEarlyMorning"
                    control={control}
                  >
                    <Select options={wakeUpTimeOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_need_to_use_bathroom')}
                    hasFeedback
                    name="needToUseBathroom"
                    control={control}
                  >
                    <Select
                      options={needToUseBathroomOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_cannot_breathe_comfortably')}
                    hasFeedback
                    name="cannotBreatheComfortably"
                    control={control}
                  >
                    <Select
                      options={cannotBreatheComfortablyOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_cough_or_snore_loudly')}
                    hasFeedback
                    name="coughOrSnoreLoudly"
                    control={control}
                  >
                    <Select
                      options={coughOrSnoreLoudlyOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_feel_too_hot')}
                    hasFeedback
                    name="feelTooHot"
                    control={control}
                  >
                    <Select options={feelTooHotOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_feel_too_cold')}
                    hasFeedback
                    name="feelTooCold"
                    control={control}
                  >
                    <Select options={feelTooColdOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_had_bad_dreams')}
                    hasFeedback
                    name="hadBadDreams"
                    control={control}
                  >
                    <Select options={hadBadDreamsOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_have_pain')}
                    name="havePain"
                    control={control}
                    hasFeedback
                  >
                    <Select options={havePainOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <Form.Item
                    label={t('admin_form_other_reasons_for_trouble_sleeping')}
                    labelCol={{ span: 24 }}
                    hasFeedback
                    validateStatus={errors.otherReasonsForTroubleSleeping?.message && 'error'}
                    help={errors.otherReasonsForTroubleSleeping?.message}
                    className={cx(styles.verticalItem, styles.verticalItemWithSemiColon)}
                  >
                    <Controller
                      control={control}
                      name="otherReasonsForTroubleSleeping"
                      render={({ field: { onChange, value, ref } }) => (
                        <TextArea
                          value={value}
                          ref={ref}
                          placeholder={t('admin_form_describe_other_reasons')}
                          autoSize={{ minRows: 2 }}
                          rows={2}
                          className={styles.textArea}
                          onChange={e =>
                            handleChangeWithReset(
                              e.target.value,
                              'sleepingTroubleFrequency',
                              onChange
                            )
                          }
                        />
                      )}
                    />
                  </Form.Item>
                  <FormItem
                    label={t('admin_form_sleeping_trouble_frequency')}
                    hasFeedback
                    name="sleepingTroubleFrequency"
                    control={control}
                    disabled={!otherReasonsForTroubleSleeping}
                  >
                    <Select
                      options={sleepingTroubleFrequencyOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                </div>
              </div>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="medicineForSleep"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_medicine_for_sleep')}
                className={styles.verticalItem}
              >
                <Select
                  className={styles.selectWidth}
                  options={medicineForSleepOptions}
                  placeholder={t('admin_form_select')}
                />
              </FormItem>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="troubleStayingAwakeFrequency"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_trouble_staying_awake_frequency')}
                className={styles.verticalItem}
              >
                <Select
                  className={styles.selectWidth}
                  options={troubleStayingAwakeWhileDrivingOptions}
                  placeholder={t('admin_form_select')}
                />
              </FormItem>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="enthusiasmToGetThingsDone"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_enthusiasm_to_get_things_done')}
                className={styles.verticalItem}
              >
                <Select
                  className={styles.selectWidth}
                  options={enthusiasmToGetThingsDoneOptions}
                  placeholder={t('admin_form_select')}
                />
              </FormItem>
            </li>
            <li>
              <FormItem
                hasFeedback
                name="sleepQualityRating"
                control={control}
                labelCol={{ span: 24 }}
                label={t('admin_form_sleep_quality_rating')}
                className={styles.verticalItem}
              >
                <Select
                  className={styles.selectWidth}
                  options={sleepQualityRatingOptions}
                  placeholder={t('admin_form_select')}
                />
              </FormItem>
            </li>
            <li>
              <Form.Item
                label={t('admin_form_have_bed_partner_or_room_mate')}
                labelCol={{ span: 24 }}
                hasFeedback
                validateStatus={errors.haveBedPartnerOrRoomMate?.message && 'error'}
                help={errors.haveBedPartnerOrRoomMate?.message}
                className={styles.verticalItem}
              >
                <Controller
                  control={control}
                  name="haveBedPartnerOrRoomMate"
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      ref={ref}
                      value={value}
                      className={styles.selectWidth}
                      options={haveBedPartnerOrRoomMateOptions}
                      placeholder={t('admin_form_select')}
                      onChange={value => {
                        handleHavePartnerChange(value, onChange);
                      }}
                    />
                  )}
                />
              </Form.Item>
            </li>
            <li>
              <div className={styles.troubleSleepingContainer}>
                <Text strong>{t('admin_form_ask_your_partner')}</Text>
                <div className={styles.noStylesLabelContainer}>
                  <FormItem
                    label={t('admin_form_loud_snoring')}
                    hasFeedback
                    name="loudSnoring"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select options={loudSnoringOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_breathing_pause')}
                    hasFeedback
                    name="breathingPause"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select options={breathingPauseOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_legs_twitching')}
                    hasFeedback
                    name="legsTwitching"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select options={legsTwitchingOptions} placeholder={t('admin_form_select')} />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_sleep_disorientation')}
                    hasFeedback
                    name="sleepDisorientation"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select
                      options={sleepDisorientationOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_cough_or_snore_loudly')}
                    hasFeedback
                    name="coughOrSnoreLoudlyRoomMate"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select
                      options={coughOrSnoreLoudlyRoomMateOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_feel_too_cold')}
                    hasFeedback
                    name="feelTooColdRoomMate"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select
                      options={feelTooColdRoomMateOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_feel_too_hot')}
                    hasFeedback
                    name="feelTooHotRoomMate"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select
                      options={feelTooHotRoomMateOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_had_bad_dreams')}
                    hasFeedback
                    name="hadBadDreamsRoomMate"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select
                      options={hadBadDreamsRoomMateOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <FormItem
                    label={t('admin_form_have_pain')}
                    hasFeedback
                    name="havePainRoomMate"
                    control={control}
                    disabled={shouldDisablePartnerQuestions}
                  >
                    <Select
                      options={havePainRoomMateOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                  <Form.Item
                    label={t('admin_form_other_restlessness')}
                    labelCol={{ span: 24 }}
                    className={cx(styles.verticalItem, styles.verticalItemWithSemiColon)}
                    hasFeedback
                    validateStatus={errors.otherRestlessness?.message && 'error'}
                    help={errors.otherRestlessness?.message}
                  >
                    <Controller
                      control={control}
                      name="otherRestlessness"
                      render={({ field: { onChange, value, ref } }) => (
                        <TextArea
                          value={value}
                          ref={ref}
                          placeholder={t('admin_form_describe_other_restlessness')}
                          autoSize={{ minRows: 2 }}
                          rows={2}
                          className={styles.textArea}
                          disabled={shouldDisablePartnerQuestions}
                          onChange={e =>
                            handleChangeWithReset(
                              e.target.value,
                              'otherRestlessnessFrequency',
                              onChange
                            )
                          }
                        />
                      )}
                    />
                  </Form.Item>
                  <FormItem
                    hasFeedback
                    name="otherRestlessnessFrequency"
                    label={t('admin_form_other_restlessness_frequency')}
                    control={control}
                    disabled={shouldDisablePartnerQuestions || !otherRestlessness}
                  >
                    <Select
                      options={otherRestlessNessFrequencyOptions}
                      placeholder={t('admin_form_select')}
                    />
                  </FormItem>
                </div>
              </div>
            </li>
          </ol>
        </Form>
      </StyledCard>
      <FormButtons
        onConfirm={handleSubmit(onSubmit)}
        containerClassName={stylish.formButtonContainer}
      />
      <NavigationBlockerModal shouldBlock />
    </div>
  );
};

export default memo(Sleep);
