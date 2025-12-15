import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { Checkbox, Col, Form, Select, TimePicker } from 'antd';
import type { FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { weekDaysOptions } from '@ProcarefulAdmin/constants/workingHours';
import { useHandleWorkingDays } from '@ProcarefulAdmin/hooks/useWorkingHours';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { supportManagementSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  formatWorkingDays,
  sortWorkingDays,
  transformPickedDays,
} from '@ProcarefulAdmin/utils/workingHoursUtils';
import {
  type ErrorResponse,
  useCaregiverControllerGetWorkingHours,
  useCaregiverControllerUpdateWorkingHours,
  getCaregiverControllerGetWorkingHoursQueryKey,
} from '@Procareful/common/api';
import { TimeFormat, useNotificationContext } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { Spinner } from '@Procareful/ui';
import CardTitle from './CardTitle';
import { useStyles } from './styles';

type SupportManagementData = z.infer<typeof supportManagementSchema>;

const { HH_MM } = TimeFormat;

const WorkingHours = () => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const [workingHoursEnabled, setWorkingHoursEnabled] = useState(false);
  const { setDirty } = useFormDirtyStore(state => ({
    setDirty: state.setDirty,
  }));

  const { data: institutionWorkingHoursData, isLoading } = useCaregiverControllerGetWorkingHours();
  const { email, phone } = institutionWorkingHoursData?.details || {};

  const { mutate: updateCaregiverWorkingHours, isPending: isUpdating } =
    useCaregiverControllerUpdateWorkingHours({
      mutation: {
        onSuccess: () => {
          notificationApi.success({
            message: t('admin_form_alert_saved'),
            description: t('admin_form_alert_successfully_saved_data'),
          });

          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetWorkingHoursQueryKey(),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const hasWorkingHoursSet = (institutionWorkingHoursData?.details?.days?.length ?? 0) > 0;
  const formattedWorkingDays = formatWorkingDays(institutionWorkingHoursData?.details?.days);

  const {
    pickedDays,
    handleSelectChange,
    handleDeselectChange,
    resetToInitialState,
    handleRangePickerChange,
  } = useHandleWorkingDays(formattedWorkingDays);

  const matchWorkingDays = sortWorkingDays(pickedDays);
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    setError,
  } = useForm<SupportManagementData>({
    resolver: zodResolver(supportManagementSchema),
    defaultValues: {
      workingDays: sortWorkingDays(pickedDays),
      ...pickedDays,
    },
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const onSubmit: SubmitHandler<SupportManagementData> = () => {
    if (!pickedDays) {
      return;
    }

    updateCaregiverWorkingHours({
      data: {
        days: transformPickedDays(pickedDays),
      },
    });
  };

  const handleFormReset = () => {
    resetToInitialState();
    reset();
  };

  useEffect(() => {
    if (hasWorkingHoursSet) {
      setWorkingHoursEnabled(hasWorkingHoursSet);
    }
  }, [setWorkingHoursEnabled, hasWorkingHoursSet]);

  useEffect(() => {
    const formattedWorkingDays = formatWorkingDays(institutionWorkingHoursData?.details?.days);
    const sortedDays = sortWorkingDays(formattedWorkingDays);

    reset({
      phoneNumber: phone || undefined,
      emailAddress: email || undefined,
      workingDays: sortedDays,
      ...formattedWorkingDays,
    });
  }, [email, phone, reset, institutionWorkingHoursData?.details?.days]);

  useEffect(() => {
    setDirty('workingHours', isDirty);
  }, [isDirty, setDirty]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <StyledCard title={<CardTitle />}>
      <div className={styles.checkboxContainer}>
        <Checkbox
          checked={workingHoursEnabled}
          onChange={() => setWorkingHoursEnabled(currentValue => !currentValue)}
        >
          {t('admin_form_enable_working_hours')}
        </Checkbox>
      </div>
      <Form layout="horizontal" className={styles.form} onFinish={handleSubmit(onSubmit)}>
        <Col span={12}>
          <FormItem name="workingDays" label={t('admin_form_days')} {...formItemCommonProps}>
            <Select
              mode="multiple"
              placeholder={t('admin_form_please_select')}
              options={weekDaysOptions}
              className={styles.select}
              onSelect={handleSelectChange}
              onDeselect={handleDeselectChange}
              disabled={!workingHoursEnabled}
            />
          </FormItem>
          {matchWorkingDays?.map(day => (
            <FormItem
              key={day}
              name={day}
              label={t(`admin_form_${day.toLocaleLowerCase()}`)}
              help={errors?.[day]?.[0]?.message}
              {...formItemCommonProps}
            >
              <TimePicker.RangePicker
                id={day}
                format={[HH_MM, HH_MM]}
                placeholder={[t('admin_form_start_time'), t('admin_form_end_time')]}
                onCalendarChange={dates => handleRangePickerChange(dates, day)}
                disabled={!workingHoursEnabled}
              />
            </FormItem>
          ))}
        </Col>
        <FormControls
          onReset={handleFormReset}
          onSubmit={handleSubmit(onSubmit)}
          loading={isUpdating}
          disabled={!workingHoursEnabled}
        />
      </Form>
    </StyledCard>
  );
};

export default WorkingHours;
