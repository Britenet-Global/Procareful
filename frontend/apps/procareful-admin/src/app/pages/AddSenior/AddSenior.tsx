import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Col, DatePicker, Form, Input, Row, type UploadFile } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import TextArea from 'antd/es/input/TextArea';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import AvatarUpload from '@ProcarefulAdmin/components/Upload';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/addSeniorStyles';
import { seniorBasicInfoSchema } from '@ProcarefulAdmin/utils';
import {
  type ErrorResponse,
  getCaregiverControllerGetUsersQueryKey,
  useAdminInstitutionControllerUploadImageForSenior,
  useCaregiverControllerAddAddress,
  useCaregiverControllerAddUser,
} from '@Procareful/common/api';
import {
  useToggle,
  useTypedTranslation,
  SearchParams,
  setBackendFieldErrors,
  TimeFormat,
  formatNumbersOnly,
} from '@Procareful/common/lib';
import { MaskedInput, Paragraph, PhoneNumberInput } from '@Procareful/ui';
import FormButtons from '../AddSeniorAssessment/FormButtons';
import { useStyles } from './styles';

type SeniorBasicInfoData = z.infer<typeof seniorBasicInfoSchema>;

const AddSenior = () => {
  const stylish = useStylish();
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<UploadFile | null>();
  const navigate = useNavigate();

  const [seniorId, setSeniorId] = useState<string>();
  const [isErrorModalVisible, toggleErrorModal] = useToggle();
  const [isSeniorSuccessModalVisible, toggleSeniorSuccessModal] = useToggle();
  const [isNextStepModalVisible, toggleNextStepModal] = useToggle();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SeniorBasicInfoData>({
    resolver: zodResolver(seniorBasicInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      phoneNumber: '',
      emailAddress: '',
      city: '',
      street: '',
      building: '',
      flat: '',
      zipCode: '',
      additionalInfo: '',
    },
  });

  const basicInfoInputCommonProps = {
    control,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const seniorDetailsInputCommonProps = {
    control,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const { mutateAsync: updateSeniorBasicInfo, isPending: isAddingUserPending } =
    useCaregiverControllerAddUser({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetUsersQueryKey(),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
          toggleErrorModal();
        },
        meta: {
          disableGlobalNotification: true,
        },
      },
    });

  const { mutateAsync: updateSeniorDetails, isPending: isAddingUserAddressPending } =
    useCaregiverControllerAddAddress({
      mutation: {
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
          toggleErrorModal();
        },
      },
    });

  const { mutate: updateSeniorImage, isPending: isUpdateUserImagePending } =
    useAdminInstitutionControllerUploadImageForSenior();

  const onSubmit: SubmitHandler<SeniorBasicInfoData> = async ({
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    emailAddress,
    city,
    street,
    building,
    flat,
    zipCode,
    additionalInfo,
  }) => {
    const { details: seniorIdResponse } = await updateSeniorBasicInfo({
      data: {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth.toISOString(),
        email_address: emailAddress || undefined,
        phone_number: phoneNumber,
      },
    });

    if (!seniorIdResponse) {
      return;
    }

    setSeniorId(seniorIdResponse.toString());

    const seniorIdNumber = Number(seniorIdResponse);
    const selectedFile = file?.originFileObj;

    if (selectedFile) {
      updateSeniorImage({
        seniorId: seniorIdNumber,
        data: {
          file: selectedFile,
        },
      });
    }

    await updateSeniorDetails({
      userId: seniorIdNumber,
      data: {
        city,
        street,
        building,
        flat,
        zip_code: zipCode,
        additional_info: additionalInfo,
      },
    });

    toggleSeniorSuccessModal();
  };

  const handleSeniorSuccessModalCancel = () => {
    toggleSeniorSuccessModal();
    toggleNextStepModal();
  };

  const handleModalConfirmation = (redirectPath: PathRoutes) => {
    if (!seniorId) {
      return;
    }

    navigate({
      pathname: redirectPath,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorId,
      }).toString(),
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Form layout="horizontal" autoComplete="off" className={styles.form}>
          <StyledCard title={t('admin_title_basic_information')} fullHeight>
            <Row>
              <Col>
                <FormItem
                  name="firstName"
                  label={t('admin_form_first_name')}
                  required
                  {...basicInfoInputCommonProps}
                >
                  <Input className={styles.inputWide} />
                </FormItem>
                <FormItem
                  name="lastName"
                  label={t('admin_form_last_name')}
                  required
                  {...basicInfoInputCommonProps}
                >
                  <Input className={styles.inputWide} />
                </FormItem>
                <FormItem
                  name="dateOfBirth"
                  label={t('admin_form_date_of_birth')}
                  required
                  {...basicInfoInputCommonProps}
                >
                  <DatePicker
                    placeholder={t('admin_form_select_date')}
                    format={TimeFormat.DATE_FORMAT}
                    className={styles.inputShort}
                    {...basicInfoInputCommonProps}
                  />
                </FormItem>
                <div className={styles.contactContainer}>
                  <FormItem
                    name="phoneNumber"
                    label={t('shared_form_phone_number')}
                    required
                    {...basicInfoInputCommonProps}
                  >
                    <PhoneNumberInput className={styles.inputWide} />
                  </FormItem>
                  <FormItem
                    name="emailAddress"
                    label={t('shared_form_email')}
                    {...basicInfoInputCommonProps}
                  >
                    <Input className={styles.inputWide} />
                  </FormItem>
                </div>
              </Col>
              <Col span={2} offset={3}>
                <FormItem name="avatar" control={control}>
                  <AvatarUpload onFileChange={setFile} placeholderSize="big" />
                </FormItem>
              </Col>
            </Row>
          </StyledCard>
          <StyledCard title={t('admin_title_stepper_senior_details')}>
            <Row>
              <Col>
                <FormItem
                  name="city"
                  label={t('admin_form_city')}
                  {...seniorDetailsInputCommonProps}
                >
                  <Input className={styles.inputWide} />
                </FormItem>
                <FormItem
                  name="street"
                  label={t('admin_form_street')}
                  {...seniorDetailsInputCommonProps}
                >
                  <Input className={styles.inputWide} />
                </FormItem>
                <FormItem
                  name="building"
                  label={t('admin_form_building')}
                  {...seniorDetailsInputCommonProps}
                >
                  <Input className={styles.inputShort} />
                </FormItem>
                <FormItem
                  name="flat"
                  label={t('admin_form_flat')}
                  {...seniorDetailsInputCommonProps}
                >
                  <Input className={styles.inputShort} />
                </FormItem>
                <FormItem
                  label={t('admin_form_zip_code')}
                  name="zipCode"
                  help={errors.zipCode?.message}
                  wrapperCol={{ span: 8 }}
                  {...seniorDetailsInputCommonProps}
                >
                  <MaskedInput maskFunction={val => formatNumbersOnly(val, true)} />
                </FormItem>
                <FormItem
                  name="additionalInfo"
                  label={t('admin_form_additional_info')}
                  {...seniorDetailsInputCommonProps}
                >
                  <TextArea
                    placeholder={t('admin_form_additional_info_placeholder')}
                    autoSize={{ minRows: 2 }}
                    rows={2}
                    className={styles.inputWide}
                  />
                </FormItem>
              </Col>
            </Row>
          </StyledCard>
        </Form>
        <PromptModal
          open={isErrorModalVisible}
          title={t('admin_title_duplicate_entry_alert')}
          type="warning"
          notificationContent={{
            header: t('admin_alert_senior_exist'),
          }}
          onCancel={toggleErrorModal}
        >
          <Paragraph>{t('admin_alert_senior_exist_subtitle')}</Paragraph>
        </PromptModal>
        <PromptModal
          open={isSeniorSuccessModalVisible}
          title={t('admin_alert_senior_account_created')}
          notificationContent={{
            description: t('admin_alert_senior_account_created_subtitle'),
          }}
          cancelButtonText={t('admin_btn_skip_for_now')}
          confirmButtonText={t('shared_btn_continue')}
          onCancel={handleSeniorSuccessModalCancel}
          onConfirm={() => handleModalConfirmation(PathRoutes.SeniorAddSupportingContacts)}
          confirmButtonType="primary"
        />
        <PromptModal
          open={isNextStepModalVisible}
          title={t('admin_alert_what_to_do_next')}
          notificationContent={{
            description: t('admin_alert_next_step_subtitle'),
          }}
          cancelButtonText={t('admin_btn_finish')}
          confirmButtonText={t('admin_btn_proceed_to_assessment')}
          onCancel={() => handleModalConfirmation(PathRoutes.SeniorProfile)}
          onConfirm={() => handleModalConfirmation(PathRoutes.SeniorAddEntry)}
          confirmButtonType="primary"
        />
      </div>
      <FormButtons
        confirmButtonText={t('admin_btn_create_senior_account')}
        onConfirm={handleSubmit(onSubmit)}
        containerClassName={stylish.formButtonContainer}
        loading={isAddingUserPending || isAddingUserAddressPending || isUpdateUserImagePending}
      />
    </div>
  );
};

export default AddSenior;
