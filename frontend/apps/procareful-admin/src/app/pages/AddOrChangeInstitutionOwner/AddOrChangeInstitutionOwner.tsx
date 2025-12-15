import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Trans } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { INSTITUTION_NAME_INPUT_MAX_CHARS, PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { changeInstitutionOwnerSchema } from '@ProcarefulAdmin/utils';
import {
  type ErrorResponse,
  useAdminControllerAddSuperInstitutionAdmin,
  useAdminControllerChangeInstitutionOwner,
  useAdminControllerGetSuperInstitutionAdmin,
} from '@Procareful/common/api';
import {
  setBackendFieldErrors,
  useNotificationContext,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import { PhoneNumberInput, Spinner } from '@Procareful/ui';
import { useStyles } from './styles';

type AddOrChangeInstitutionOwnerData = z.infer<typeof changeInstitutionOwnerSchema>;

const AddOrChangeInstitutionOwner = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const stylish = useStylish({ formMode: 'add' });
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { notificationApi } = useNotificationContext();
  const navigate = useNavigate();

  const isAddingInstitutionOwner = pathname === PathRoutes.InstitutionsAdd;
  const institutionId = Number(searchParams.get(SearchParams.Id));
  const superAdminId = Number(searchParams.get(SearchParams.SuperAdminId));

  const { data: superAdminData, isLoading: isSuperInstitutionDataLoading } =
    useAdminControllerGetSuperInstitutionAdmin(superAdminId, {
      query: {
        enabled: Boolean(superAdminId),
      },
    });

  const institutionName = superAdminData?.details.institution.name;

  const { control, handleSubmit, setError } = useForm<AddOrChangeInstitutionOwnerData>({
    resolver: zodResolver(changeInstitutionOwnerSchema),
    values: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      institutionName: institutionName || '',
    },
  });

  const { mutate: changeInstitutionOwner, isPending: isChangeInstitutionOwnerPending } =
    useAdminControllerChangeInstitutionOwner({
      mutation: {
        onSuccess: (data, variables) => {
          const newOwnerId = data?.details.newOwnerId;

          if (!institutionId || !newOwnerId || !institutionName) {
            return;
          }

          notificationApi.success({
            message: t('admin_title_invitation_sent'),
            description: (
              <Trans
                i18nKey="admin_title_alert_description"
                values={{ insertedEmail: variables.data.email_address }}
              />
            ),
          });

          navigate({
            pathname: PathRoutes.InstitutionDetailsHeadAdmin,
            search: new URLSearchParams({
              [SearchParams.Id]: institutionId.toString(),
              [SearchParams.SuperAdminId]: newOwnerId.toString(),
              [SearchParams.PageTitle]: encodeURIComponent(institutionName),
            }).toString(),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const { mutate: addSuperInstitutionAdmin, isPending: isAddInstitutionOwnerPending } =
    useAdminControllerAddSuperInstitutionAdmin({
      mutation: {
        onSuccess: (_, { data }) => {
          const insertedEmail = data.email_address;
          notificationApi.success({
            message: t('admin_title_invitation_sent'),
            description: (
              <Trans i18nKey="admin_title_alert_description" values={{ insertedEmail }} />
            ),
          });
          navigate(PathRoutes.Institutions);
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const onSubmit: SubmitHandler<AddOrChangeInstitutionOwnerData> = ({
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    institutionName,
  }) => {
    const payloadBase = {
      first_name: firstName,
      last_name: lastName,
      email_address: emailAddress,
      phone_number: phoneNumber,
    };

    if (isAddingInstitutionOwner) {
      addSuperInstitutionAdmin({
        data: {
          ...payloadBase,
          institution_name: institutionName,
        },
      });

      return;
    }

    changeInstitutionOwner({
      adminId: superAdminId,
      data: payloadBase,
    });
  };

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const showTooltip =
    institutionName && institutionName.length >= INSTITUTION_NAME_INPUT_MAX_CHARS
      ? institutionName
      : undefined;

  if (isSuperInstitutionDataLoading) {
    return <Spinner />;
  }

  return (
    <StyledCard
      title={t('admin_title_institution_owner')}
      subtitle={!isAddingInstitutionOwner && t('admin_inf_institution_owner_change')}
      className={styles.cardContainer}
    >
      <Form layout="horizontal" className={stylish.form} onFinish={handleSubmit(onSubmit)}>
        <div className={styles.nameContainer}>
          <FormItem
            name="firstName"
            label={t('admin_form_first_name')}
            {...formItemCommonProps}
            required
          >
            <Input autoCapitalize="words" />
          </FormItem>
          <FormItem
            name="lastName"
            label={t('admin_form_last_name')}
            {...formItemCommonProps}
            required
          >
            <Input />
          </FormItem>
        </div>
        <FormItem
          name="emailAddress"
          label={t('admin_form_email')}
          {...formItemCommonProps}
          required
        >
          <Input />
        </FormItem>
        <FormItem
          name="phoneNumber"
          label={t('admin_form_cellphone')}
          {...formItemCommonProps}
          required
        >
          <PhoneNumberInput />
        </FormItem>
        <FormItem
          name="institutionName"
          label={t('admin_form_institution')}
          tooltip={showTooltip}
          required={isAddingInstitutionOwner}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormControls
          resetButtonText={t('shared_btn_cancel')}
          onReset={() => navigate(-1)}
          confirmButtonText={t('admin_btn_send_invitation')}
          confirmButtonHtmlType="submit"
          loading={isChangeInstitutionOwnerPending || isAddInstitutionOwnerPending}
          danger={!isAddingInstitutionOwner}
        />
      </Form>
    </StyledCard>
  );
};

export default AddOrChangeInstitutionOwner;
