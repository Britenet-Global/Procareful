import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import { Alert, Col, Form, Input, Select, TimePicker } from 'antd';
import type { FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import NavigationBlockerModal from '@ProcarefulAdmin/components/NavigationBlockerModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { weekDaysOptions } from '@ProcarefulAdmin/constants/workingHours';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import { useHandleWorkingDays } from '@ProcarefulAdmin/hooks/useWorkingHours';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import { supportManagementSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  formatWorkingDays,
  sortWorkingDays,
  transformPickedDays,
} from '@ProcarefulAdmin/utils/workingHoursUtils';
import {
  useAdminInstitutionControllerUpdateWorkingHours,
  useAdminInstitutionControllerGetWorkingHours,
  getAdminInstitutionControllerGetWorkingHoursQueryKey,
  AdminRolesDtoRoleName,
  getAuthControllerGetMeQueryKey,
  type GetMeResponseDto,
  type ErrorResponse,
} from '@Procareful/common/api';
import { TimeFormat, useNotificationContext } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { PhoneNumberInput, Title, Spinner } from '@Procareful/ui';
import { useStyles } from './styles';

type SupportManagementData = z.infer<typeof supportManagementSchema>;

const { HH_MM } = TimeFormat;

const SupportManagement = () => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const { isOnboardingPage } = useOnboardingStepComplete();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isSuperAdmin = verifyAccessByRole(
    AdminRolesDtoRoleName.superAdminInstitution,
    userData?.details.admin.roles
  );

  const inputReadOnlyConfig = isSuperAdmin ? {} : { readOnly: true, disabled: true };

  const { data: institutionWorkingHoursData, isLoading } =
    useAdminInstitutionControllerGetWorkingHours();
  const { email, phone } = institutionWorkingHoursData?.details || {};
  const { mutate: updateInstitutionWorkingHours, isPending: isUpdatingWorkingHours } =
    useAdminInstitutionControllerUpdateWorkingHours({
      mutation: {
        onSuccess: () => {
          notificationApi.success({
            message: t('admin_form_alert_saved'),
            description: t('admin_form_alert_successfully_saved_data'),
          });
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetWorkingHoursQueryKey(),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const formattedWorkingDays = formatWorkingDays(institutionWorkingHoursData?.details?.days);

  const {
    pickedDays,
    handleSelectChange,
    handleDeselectChange,
    resetToInitialState,
    handleRangePickerChange,
  } = useHandleWorkingDays(formattedWorkingDays);

  const sortedWorkingDays = sortWorkingDays(pickedDays);

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    setError,
  } = useForm<SupportManagementData>({
    resolver: zodResolver(supportManagementSchema),
    defaultValues: {
      phoneNumber: phone || '',
      emailAddress: email || '',
      workingDays: sortedWorkingDays,
      ...pickedDays,
    },
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const onSubmit: SubmitHandler<SupportManagementData> = ({ phoneNumber, emailAddress }) => {
    if (!pickedDays) {
      return;
    }

    updateInstitutionWorkingHours({
      data: {
        email: emailAddress,
        phone: phoneNumber,
        days: transformPickedDays(pickedDays),
      },
    });
  };

  const handleFormReset = () => {
    resetToInitialState();
    reset();
  };

  useEffect(() => {
    const formattedWorkingDays = formatWorkingDays(institutionWorkingHoursData?.details?.days);
    const sortedDays = sortWorkingDays(formattedWorkingDays);

    reset({
      phoneNumber: phone || '',
      emailAddress: email || '',
      workingDays: sortedDays,
      ...formattedWorkingDays,
    });
  }, [email, phone, reset, institutionWorkingHoursData?.details?.days]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className={styles.container}>
        <StyledCard
          title={t('admin_title_support_management')}
          subtitle={t('admin_inf_manage_support_contact_information')}
        >
          <Alert
            banner
            rootClassName={styles.alert}
            description={t('admin_alert_support_management_tile_info')}
            type="info"
            showIcon
          />
          <Form layout="horizontal" className={styles.form} onFinish={handleSubmit(onSubmit)}>
            <Col span={12}>
              <Title level={6} className={styles.formTitle}>
                {t('admin_inf_contact_for_support')}
              </Title>
            </Col>
            <Col span={12}>
              <FormItem
                name="phoneNumber"
                label={t('admin_form_phone_number')}
                {...formItemCommonProps}
              >
                <PhoneNumberInput {...inputReadOnlyConfig} isOptional />
              </FormItem>
              <FormItem
                name="emailAddress"
                label={t('admin_form_email')}
                required
                {...formItemCommonProps}
              >
                <Input {...inputReadOnlyConfig} />
              </FormItem>
            </Col>
            <Col span={12} className={styles.marginTop}>
              <Title level={6} className={styles.formTitle}>
                {t('admin_inf_working_hours')}
              </Title>
              <FormItem name="workingDays" label={t('admin_form_days')} {...formItemCommonProps}>
                <Select
                  mode="multiple"
                  placeholder={t('admin_form_please_select')}
                  options={weekDaysOptions}
                  className={styles.select}
                  onSelect={handleSelectChange}
                  onDeselect={handleDeselectChange}
                  {...inputReadOnlyConfig}
                />
              </FormItem>
              {sortedWorkingDays?.map(day => (
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
                    {...inputReadOnlyConfig}
                  />
                </FormItem>
              ))}
            </Col>
            {isSuperAdmin && (
              <FormControls
                onReset={handleFormReset}
                onSubmit={handleSubmit(onSubmit)}
                loading={isUpdatingWorkingHours}
              />
            )}
          </Form>
        </StyledCard>
      </div>
      <NavigationBlockerModal shouldBlock={isDirty && isOnboardingPage} />
    </>
  );
};

export default SupportManagement;
