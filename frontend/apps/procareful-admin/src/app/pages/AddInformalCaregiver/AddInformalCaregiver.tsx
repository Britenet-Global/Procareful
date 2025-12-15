import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { addCaregiverSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  type ErrorResponse,
  getAdminInstitutionControllerGetInformalCaregiversQueryKey,
  useAdminInstitutionControllerAddInformalCaregiver,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useTypedTranslation,
  setBackendFieldErrors,
  formatNumbersOnly,
} from '@Procareful/common/lib';
import { MaskedInput, PhoneNumberInput, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type AddInformalCaregiverData = z.infer<typeof addCaregiverSchema>;

const AddInformalCaregiver = () => {
  const { styles } = useStyles();
  const stylish = useStylish({ formMode: 'add' });
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AddInformalCaregiverData>({
    resolver: zodResolver(addCaregiverSchema),
    defaultValues: { firstName: '', lastName: '' },
  });

  const { mutate: addInformalCaregiver, isPending } =
    useAdminInstitutionControllerAddInformalCaregiver({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetInformalCaregiversQueryKey(),
          });
          notificationApi.success({
            message: t('admin_title_new_user_successful'),
            description: t('admin_inf_new_informal_caregiver_subtitle'),
          });
          navigate(PathRoutes.InstitutionUsers);
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const onSubmit: SubmitHandler<AddInformalCaregiverData> = ({
    emailAddress,
    firstName,
    lastName,
    phoneNumber,
    building,
    flat,
    city,
    street,
    zipCode,
  }) => {
    addInformalCaregiver({
      data: {
        email_address: emailAddress,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || '',
        address: {
          building,
          flat,
          street,
          city,
          zip_code: zipCode,
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      <Form layout="horizontal" className={stylish.form}>
        <StyledCard title={t('admin_title_basic_info')}>
          <FormItem
            name="firstName"
            label={t('admin_form_first_name')}
            wrapperCol={{ span: 15 }}
            help={errors.firstName?.message}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>

          <FormItem
            name="lastName"
            label={t('admin_form_last_name')}
            wrapperCol={{ span: 15 }}
            help={errors.lastName?.message}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
        </StyledCard>
        <StyledCard title={t('admin_title_user_contact_information')}>
          <FormItem
            name="phoneNumber"
            label={t('admin_form_phone_number')}
            wrapperCol={{ span: 15 }}
            help={errors.phoneNumber?.message}
            {...formItemCommonProps}
          >
            <PhoneNumberInput />
          </FormItem>
          <FormItem
            name="emailAddress"
            label={t('admin_form_email')}
            wrapperCol={{ span: 15 }}
            help={errors.emailAddress?.message}
            {...formItemCommonProps}
          >
            <Input />
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
        </StyledCard>
      </Form>
      <FormControls
        onReset={() => navigate(-1)}
        loading={isPending}
        onSubmit={handleSubmit(onSubmit)}
        confirmButtonText={t('shared_btn_save')}
        resetButtonText={t('shared_btn_cancel')}
      />
    </div>
  );
};

export default AddInformalCaregiver;
