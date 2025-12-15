import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import ResendRegistrationLinkButton from '@ProcarefulAdmin/components/ResendRegistrationLinkButton';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PathRoutes, statusValueToDisplay } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { editSuperAdminInstitutionSchema } from '@ProcarefulAdmin/utils';
import { GetSuperInstitutionAdminDtoStatusStatusName } from '@Procareful/common/api';
import { type Key, SearchParams, useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph, PhoneNumberInput, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type EditSuperInstitutionAdmin = z.infer<typeof editSuperAdminInstitutionSchema>;
type SuperAdminDetailsProps = EditSuperInstitutionAdmin;

const SuperAdminDetails = ({
  firstName,
  lastName,
  emailAddress,
  phoneNumber,
  status,
}: SuperAdminDetailsProps) => {
  const stylish = useStylish();
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const institutionId = Number(searchParams.get(SearchParams.Id));
  const superAdminId = Number(searchParams.get(SearchParams.SuperAdminId));

  const { control } = useForm<EditSuperInstitutionAdmin>({
    resolver: zodResolver(editSuperAdminInstitutionSchema),
    values: {
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      status: status
        ? t(statusValueToDisplay[status as keyof typeof statusValueToDisplay] as Key)
        : undefined,
    },
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
    readOnly: true,
    disabled: true,
  };

  const handleChangeOwnerClick = () => {
    if (!institutionId || !superAdminId) {
      return;
    }

    navigate({
      pathname: PathRoutes.ChangeInstitutionOwner,
      search: new URLSearchParams({
        [SearchParams.Id]: institutionId.toString(),
        [SearchParams.SuperAdminId]: superAdminId.toString(),
      }).toString(),
    });
  };

  return (
    <StyledCard title={t('admin_title_institution_owner')}>
      <Form layout="horizontal" className={stylish.form}>
        <div className={styles.nameContainer}>
          <FormItem name="firstName" label={t('admin_form_first_name')} {...formItemCommonProps}>
            <Input autoCapitalize="words" />
          </FormItem>
          <FormItem name="lastName" label={t('admin_form_last_name')} {...formItemCommonProps}>
            <Input />
          </FormItem>
        </div>
        <FormItem
          name="emailAddress"
          label={t('admin_form_email')}
          {...formItemCommonProps}
          hasFeedback
        >
          <Input />
        </FormItem>
        <FormItem
          name="phoneNumber"
          label={t('admin_form_cellphone')}
          {...formItemCommonProps}
          hasFeedback
        >
          <PhoneNumberInput />
        </FormItem>
        <div className={styles.statusContainer}>
          <div className={styles.statusRow}>
            <FormItem
              name="status"
              label={t('admin_form_status')}
              {...formItemCommonProps}
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 24 }}
            >
              <Input readOnly disabled />
            </FormItem>
            {status === GetSuperInstitutionAdminDtoStatusStatusName.created && (
              <ResendRegistrationLinkButton userId={superAdminId} />
            )}
          </div>
          <div className={styles.textContainer}>
            <Title level={6} className={styles.actionTitle}>
              {t('admin_title_change_institution_owner')}
            </Title>
            <Paragraph className={styles.changeInstitutionNameContent}>
              {t('admin_inf_change_institution_owner_description')}
            </Paragraph>
            <Button type="default" danger onClick={handleChangeOwnerClick}>
              {t('admin_btn_change_owner')}
            </Button>
          </div>
        </div>
      </Form>
    </StyledCard>
  );
};
export default SuperAdminDetails;
