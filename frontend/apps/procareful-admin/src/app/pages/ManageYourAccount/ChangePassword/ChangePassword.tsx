import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { changePasswordSchema } from '@ProcarefulAdmin/utils';
import { type ErrorResponse, useAuthControllerChangePassword } from '@Procareful/common/api';
import {
  setBackendFieldErrors,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { useStyles } from './styles';

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();

  const { setDirty } = useFormDirtyStore(state => ({
    setDirty: state.setDirty,
  }));

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty },
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutate: changePassword, isPending } = useAuthControllerChangePassword({
    mutation: {
      onSuccess: () => {
        notificationApi.success({
          message: t('admin_alert_password_updated_title'),
          description: t('admin_alert_password_updated_subtitle'),
        });
        reset();
      },
      onError: (error: ErrorResponse) => {
        setBackendFieldErrors(error, setError);
      },
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordData> = ({
    currentPassword,
    newPassword,
    confirmNewPassword,
  }) => {
    changePassword({
      data: {
        currentPassword,
        newPassword,
        confirmNewPassword,
      },
    });
  };

  const formItemCommonProps = {
    control,
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
    className: styles.label,
  };

  useEffect(() => {
    setDirty('changePassword', isDirty);
  }, [isDirty, setDirty]);

  return (
    <StyledCard title={t('admin_title_change_password')}>
      <Form onFinish={handleSubmit(onSubmit)} layout="horizontal">
        <FormItem
          name="currentPassword"
          label={t('admin_form_current_password')}
          {...formItemCommonProps}
        >
          <Input.Password className={styles.input} />
        </FormItem>
        <FormItem name="newPassword" label={t('admin_form_new_password')} {...formItemCommonProps}>
          <Input.Password className={styles.input} />
        </FormItem>
        <FormItem
          name="confirmNewPassword"
          label={t('admin_form_confirm_new_password')}
          {...formItemCommonProps}
        >
          <Input.Password className={styles.input} />
        </FormItem>
        <FormControls
          confirmButtonText={t('shared_btn_save_changes')}
          confirmButtonHtmlType="submit"
          loading={isPending}
        />
      </Form>
    </StyledCard>
  );
};

export default ChangePassword;
