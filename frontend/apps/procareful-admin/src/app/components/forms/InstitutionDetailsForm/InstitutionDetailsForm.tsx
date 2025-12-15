import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import type { z } from 'zod';
import { Col, Form, Input, Row } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import ActionFooter from '@ProcarefulAdmin/components/FormControls';
import { INSTITUTION_NAME_INPUT_MAX_CHARS } from '@ProcarefulAdmin/constants';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils/roleUtils';
import { institutionDetailsSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  type GetMeResponseDto,
  type ErrorResponse,
  AdminRolesDtoRoleName,
  useAdminInstitutionControllerUpdateMyInstitutionDetails,
  getAdminInstitutionControllerGetInstitutionDetailsQueryKey,
  getAuthControllerGetMeQueryKey,
} from '@Procareful/common/api';
import {
  formatNumbersOnly,
  INPUT_PLACEHOLDERS,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { setBackendFieldErrors, truncateSentence } from '@Procareful/common/lib/utils';
import { Title, PhoneNumberInput, MaskedInput } from '@Procareful/ui';

type InstitutionDetailsData = z.infer<typeof institutionDetailsSchema>;

const InstitutionDetailsForm = ({
  name,
  city,
  street,
  building,
  flat,
  zipCode,
  phoneNumber,
  emailAddress,
}: InstitutionDetailsData) => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const { setDirty } = useFormDirtyStore(state => ({
    setDirty: state.setDirty,
  }));

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );
  const hasEditPermission = verifyAccessByRole(
    AdminRolesDtoRoleName.superAdminInstitution,
    userData?.details.admin.roles
  );
  const showTooltip =
    name && name.length >= INSTITUTION_NAME_INPUT_MAX_CHARS && !hasEditPermission
      ? name
      : undefined;

  const { mutate: updateInstitutionDetails, isPending } =
    useAdminInstitutionControllerUpdateMyInstitutionDetails({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetInstitutionDetailsQueryKey(),
          });
          notificationApi.success({
            message: t('admin_form_alert_saved'),
            description: t('admin_form_alert_successfully_saved_data'),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, errors },
  } = useForm<InstitutionDetailsData>({
    resolver: zodResolver(institutionDetailsSchema),
    values: {
      name: truncateSentence(name, INSTITUTION_NAME_INPUT_MAX_CHARS),
      city,
      street,
      building,
      flat,
      zipCode,
      phoneNumber,
      emailAddress,
    },
  });

  const inputConfig = hasEditPermission ? {} : { readOnly: true, disabled: true };

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const onSubmit: SubmitHandler<InstitutionDetailsData> = ({
    name,
    city,
    street,
    building,
    flat,
    zipCode,
    phoneNumber,
    emailAddress,
  }) =>
    updateInstitutionDetails({
      data: {
        name: !name?.trim().length ? undefined : name,
        city,
        street,
        building,
        flat,
        zip_code: zipCode,
        phone: phoneNumber || undefined,
        email: emailAddress || undefined,
      },
    });

  useEffect(() => {
    setDirty('institutionDetails', isDirty);
  }, [isDirty, setDirty]);

  return (
    <Form layout="horizontal" className={stylish.form} onFinish={handleSubmit(onSubmit)}>
      <Row>
        <Col span={12}>
          <FormItem
            name="name"
            label={t('admin_form_name')}
            tooltip={showTooltip}
            {...formItemCommonProps}
          >
            <Input {...inputConfig} />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Title level={6} className={stylish.formTitle}>
            {t('admin_inf_address')}
          </Title>
          <FormItem name="city" label={t('admin_form_city')} {...formItemCommonProps}>
            <Input {...inputConfig} />
          </FormItem>
          <FormItem name="street" label={t('admin_form_street')} {...formItemCommonProps}>
            <Input {...inputConfig} />
          </FormItem>
          <FormItem
            name="building"
            label={t('admin_form_building')}
            wrapperCol={{ span: 8 }}
            {...formItemCommonProps}
          >
            <Input {...inputConfig} />
          </FormItem>
          <FormItem
            name="flat"
            label={t('admin_form_flat')}
            wrapperCol={{ span: 8 }}
            {...formItemCommonProps}
          >
            <Input {...inputConfig} />
          </FormItem>
          <FormItem
            label={t('admin_form_zip_code')}
            name="zipCode"
            wrapperCol={{ span: 8 }}
            help={errors.zipCode?.message}
            {...formItemCommonProps}
          >
            <MaskedInput {...inputConfig} maskFunction={val => formatNumbersOnly(val, true)} />
          </FormItem>
        </Col>
        <Col span={12}>
          <Title level={6} className={stylish.formTitle}>
            {t('admin_inf_contact_info')}
          </Title>
          <FormItem name="phoneNumber" label={t('admin_form_cellphone')} {...formItemCommonProps}>
            <PhoneNumberInput
              {...inputConfig}
              isOptional
              placeholder={hasEditPermission ? INPUT_PLACEHOLDERS.PHONE_NUMBER : ''}
            />
          </FormItem>
          <FormItem name="emailAddress" label={t('admin_form_email')} {...formItemCommonProps}>
            <Input {...inputConfig} />
          </FormItem>
        </Col>
      </Row>
      {hasEditPermission && <ActionFooter onReset={reset} loading={isPending} />}
    </Form>
  );
};

export default InstitutionDetailsForm;
