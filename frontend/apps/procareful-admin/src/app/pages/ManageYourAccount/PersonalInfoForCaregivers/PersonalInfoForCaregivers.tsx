import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Col, Form, Input, Row, DatePicker, type UploadFile } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import AvatarUpload from '@ProcarefulAdmin/components/Upload';
import { USER_TIMEZONE } from '@ProcarefulAdmin/constants';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { updatePersonalInfoSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAuthControllerGetMeQueryKey,
  useAdminInstitutionControllerSetMyPersonalSettings,
  useAdminInstitutionControllerUploadImageForAdmin,
  useAdminInstitutionControllerGetAdminImage,
  useAdminInstitutionControllerDeleteAdminImage,
  getAdminInstitutionControllerGetAdminImageQueryKey,
  type GetMeResponseDto,
  type ErrorResponse,
} from '@Procareful/common/api';
import {
  formatNumbersOnly,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { MaskedInput, PhoneNumberInput, Spinner, Title } from '@Procareful/ui';

type UpdatePersonalInfoData = z.infer<typeof updatePersonalInfoSchema>;

const ManageYourAccount = () => {
  const stylish = useStylish({ formMode: 'add' });
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const [file, setFile] = useState<UploadFile | null>();
  const queryClient = useQueryClient();

  const { setDirty } = useFormDirtyStore(state => ({
    setDirty: state.setDirty,
  }));

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const { data: userImageData, isLoading: isImageLoading } =
    useAdminInstitutionControllerGetAdminImage();

  const { mutate: deleteUserImage } = useAdminInstitutionControllerDeleteAdminImage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAdminInstitutionControllerGetAdminImageQueryKey(),
        });
      },
    },
  });

  const { admin, address } = userData?.details || {};
  const { first_name, last_name, phone_number, email_address, date_of_birth } = admin || {};
  const { zip_code, building, city, flat, street } = address || {};

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitSuccessful },
    setError,
    reset,
  } = useForm<UpdatePersonalInfoData>({
    resolver: zodResolver(updatePersonalInfoSchema),
    values: {
      firstName: first_name || '',
      lastName: last_name || '',
      phoneNumber: phone_number || '',
      emailAddress: email_address || '',
      dateOfBirth: date_of_birth ? dayjs.utc(date_of_birth).tz(USER_TIMEZONE) : undefined,
      zipCode: zip_code || '',
      building: building || '',
      city: city || '',
      flat: flat || '',
      street: street || '',
    },
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const { mutate: updateAvatar } = useAdminInstitutionControllerUploadImageForAdmin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAdminInstitutionControllerGetAdminImageQueryKey(),
        });
      },
    },
  });

  const { mutate: updatePersonalInfo, isPending } =
    useAdminInstitutionControllerSetMyPersonalSettings({
      mutation: {
        onSuccess: () => {
          notificationApi.success({
            message: t('admin_alert_update_successful'),
            description: t('admin_alert_user_update_successful'),
          });

          queryClient.invalidateQueries({ queryKey: getAuthControllerGetMeQueryKey() });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const onSubmit: SubmitHandler<UpdatePersonalInfoData> = ({
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    emailAddress,
    ...addressData
  }) => {
    const { zipCode, ...otherAddressData } = addressData;

    updatePersonalInfo({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth?.toISOString() || null,
        email_address: emailAddress,
        address: {
          zip_code: zipCode,
          ...otherAddressData,
        },
      },
    });

    const hasUploadedUserImageBefore = Boolean(userImageData?.details);

    if (hasUploadedUserImageBefore && !file) {
      deleteUserImage();

      return;
    }

    const selectedFile = file?.originFileObj;

    if (selectedFile) {
      updateAvatar({
        data: {
          file: selectedFile,
        },
      });
    }
  };

  const setDefaultAvatarImage = useCallback(() => {
    const base64 = userImageData?.details;

    setFile(
      base64
        ? {
            uid: '-1',
            name: 'avatar.jpeg',
            status: 'done',
            size: base64.length,
            url: `data:image/jpeg;base64,${base64}`,
          }
        : null
    );
  }, [userImageData]);

  const handleResetForm = () => {
    reset();
    setDefaultAvatarImage();
  };

  useEffect(() => {
    setDefaultAvatarImage();
  }, [setDefaultAvatarImage]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setDirty('personalInfo', false);

      return;
    }

    setDirty('personalInfo', isDirty);
  }, [isDirty, setDirty, isSubmitSuccessful]);

  if (isImageLoading) {
    return <Spinner />;
  }

  return (
    <StyledCard title={t('admin_title_personal_info')}>
      <Form layout="horizontal" className={stylish.form}>
        <Row>
          <Col span={12}>
            <FormItem
              name="firstName"
              label={t('admin_form_first_name')}
              wrapperCol={{ span: 15 }}
              help={errors.firstName?.message}
              required
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
            <FormItem
              name="lastName"
              label={t('admin_form_last_name')}
              wrapperCol={{ span: 15 }}
              help={errors.lastName?.message}
              required
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
            <FormItem
              name="dateOfBirth"
              label={t('admin_form_date_of_birth')}
              wrapperCol={{ span: 9 }}
              {...formItemCommonProps}
            >
              <DatePicker placeholder={t('admin_form_select_date')} />
            </FormItem>

            <Title level={6} className={stylish.formTitle}>
              {t('admin_inf_address')}
            </Title>
            <FormItem
              name="city"
              label={t('admin_form_city')}
              wrapperCol={{ span: 8 }}
              help={errors.city?.message}
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
            <FormItem
              name="street"
              label={t('admin_form_street')}
              wrapperCol={{ span: 8 }}
              help={errors.street?.message}
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
            <FormItem
              name="building"
              label={t('admin_form_building')}
              wrapperCol={{ span: 8 }}
              help={errors.building?.message}
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
            <FormItem
              name="flat"
              label={t('admin_form_flat')}
              wrapperCol={{ span: 8 }}
              help={errors.flat?.message}
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
            <FormItem
              label={t('admin_form_zip_code')}
              name="zipCode"
              help={errors.zipCode?.message}
              wrapperCol={{ span: 8 }}
              {...formItemCommonProps}
            >
              <MaskedInput maskFunction={val => formatNumbersOnly(val, true)} />
            </FormItem>
          </Col>
          <Col span={12}>
            <AvatarUpload onFileChange={setFile} defaultFile={file} placeholderSize="small" />
            <Title level={6} className={stylish.formTitle}>
              {t('admin_inf_contact_info')}
            </Title>
            <FormItem
              name="phoneNumber"
              label={t('shared_form_phone_number')}
              required
              {...formItemCommonProps}
            >
              <PhoneNumberInput />
            </FormItem>
            <FormItem
              name="emailAddress"
              label={t('admin_form_email')}
              required
              {...formItemCommonProps}
            >
              <Input />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <FormControls
        onReset={handleResetForm}
        loading={isPending}
        onSubmit={handleSubmit(onSubmit)}
        confirmButtonText={t('shared_btn_save_changes')}
        resetButtonText={t('admin_btn_reset_changes')}
      />
    </StyledCard>
  );
};

export default ManageYourAccount;
