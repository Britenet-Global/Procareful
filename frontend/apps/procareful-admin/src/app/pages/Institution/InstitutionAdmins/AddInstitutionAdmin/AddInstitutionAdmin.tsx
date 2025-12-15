import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';
import { Form, Input } from 'antd';
import type { FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { addInstitutionAdminSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAdminInstitutionControllerGetAllAdminsInstitutionQueryKey,
  useAdminInstitutionControllerAddInstitutionAdmin,
  type ErrorResponse,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { PhoneNumberInput } from '@Procareful/ui';
import { useStyles } from './styles';

type AddInstitutionAdmin = z.infer<typeof addInstitutionAdminSchema>;

const AddInstitutionAdmin = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const stylish = useStylish({ formMode: 'add' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { control, handleSubmit, setError } = useForm<AddInstitutionAdmin>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
    },
    resolver: zodResolver(addInstitutionAdminSchema),
  });

  const { mutate: addInstitutionAdmin, isPending } =
    useAdminInstitutionControllerAddInstitutionAdmin({
      mutation: {
        onSuccess: (_, { data }) => {
          const insertedEmail = data.email_address;

          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetAllAdminsInstitutionQueryKey(),
          });
          notificationApi.success({
            message: t('admin_title_invitation_sent'),
            description: (
              <Trans i18nKey="admin_title_alert_description" values={{ insertedEmail }} />
            ),
          });
          navigate(PathRoutes.InstitutionAdmins);
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

  const onSubmit: SubmitHandler<AddInstitutionAdmin> = ({
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
  }) => {
    addInstitutionAdmin({
      data: {
        first_name: firstName,
        last_name: lastName,
        email_address: emailAddress,
        phone_number: phoneNumber,
      },
    });
  };

  return (
    <div className={styles.container}>
      <Form layout="horizontal" className={stylish.form} onFinish={handleSubmit(onSubmit)}>
        <StyledCard title={t('admin_title_basic_info')}>
          <FormItem
            name="firstName"
            label={t('admin_form_first_name')}
            wrapperCol={{ span: 15 }}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <FormItem
            name="lastName"
            label={t('admin_form_last_name')}
            wrapperCol={{ span: 15 }}
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
            {...formItemCommonProps}
          >
            <PhoneNumberInput />
          </FormItem>
          <FormItem
            name="emailAddress"
            label={t('admin_form_email')}
            wrapperCol={{ span: 15 }}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
        </StyledCard>
        <div className={styles.buttonContainer}>
          <FormControls
            resetButtonText={t('shared_btn_cancel')}
            onReset={() => navigate(-1)}
            loading={isPending}
            confirmButtonText={t('shared_btn_save')}
          />
        </div>
      </Form>
    </div>
  );
};

export default AddInstitutionAdmin;
