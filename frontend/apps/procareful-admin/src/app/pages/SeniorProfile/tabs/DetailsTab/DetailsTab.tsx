import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Col, DatePicker, Form, Input, Row, type UploadFile } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import TextArea from 'antd/es/input/TextArea';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import AvatarUpload from '@ProcarefulAdmin/components/Upload';
import { PaginationSize } from '@ProcarefulAdmin/constants';
import { seniorBasicInfoSchema } from '@ProcarefulAdmin/utils';
import {
  type ErrorResponse,
  getCaregiverControllerGetUserQueryKey,
  getCaregiverControllerGetUsersQueryKey,
  useAdminInstitutionControllerDeleteUserImage,
  useAdminInstitutionControllerUploadImageForSenior,
  useCaregiverControllerAddAddress,
  useCaregiverControllerUpdateBasicInformation,
  useCaregiverControllerGetUser,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
  setBackendFieldErrors,
  TimeFormat,
  formatNumbersOnly,
} from '@Procareful/common/lib';
import { MaskedInput, Paragraph, PhoneNumberInput, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type SeniorInfoData = z.infer<typeof seniorBasicInfoSchema>;
type SeniorFormData = Omit<SeniorInfoData, 'dateOfBirth'> & {
  dateOfBirth?: Dayjs;
};

const DetailsTab = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<UploadFile | null>();
  const [searchParams] = useSearchParams();
  const [isErrorModalVisible, toggleErrorModal] = useToggle();
  const { notificationApi } = useNotificationContext();

  const seniorId = searchParams.get(SearchParams.Id);
  const seniorIdNumber = Number(seniorId);

  const { data: seniorData } = useCaregiverControllerGetUser(Number(seniorId), {
    page: 1,
    pageSize: PaginationSize.Large,
  });

  const { address, first_name, last_name, email_address, date_of_birth, phone_number, image } =
    seniorData?.details || {};
  const { city, street, building, flat, zip_code, additional_info } = address || {};

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SeniorFormData>({
    resolver: zodResolver(seniorBasicInfoSchema),
    values: {
      firstName: first_name || '',
      lastName: last_name || '',
      dateOfBirth: date_of_birth ? dayjs(date_of_birth) : undefined,
      phoneNumber: phone_number || '',
      emailAddress: email_address || '',
      city: city || '',
      street: street || '',
      building: building || '',
      flat: flat || '',
      zipCode: zip_code || '',
      additionalInfo: additional_info || '',
    },
  });

  const inputCommonProps = {
    control,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const invalidateQueriesAfterSuccessfulUpdate = () => {
    queryClient.invalidateQueries({
      queryKey: getCaregiverControllerGetUserQueryKey(seniorIdNumber, {
        page: 1,
        pageSize: PaginationSize.Large,
      }),
    });
    queryClient.invalidateQueries({
      queryKey: getCaregiverControllerGetUsersQueryKey(),
    });
  };

  const { mutate: updateSeniorBasicInfo, isPending: isUpdatingSeniorBasicInfo } =
    useCaregiverControllerUpdateBasicInformation({
      mutation: {
        onSuccess: () => {
          invalidateQueriesAfterSuccessfulUpdate();
          notificationApi.success({
            message: t('admin_title_senior_updated'),
            description: t('admin_inf_senior_saved_subtitle'),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
          toggleErrorModal();
        },
      },
    });

  const { mutate: updateSeniorDetails, isPending: isAddingUserAddressPending } =
    useCaregiverControllerAddAddress({
      mutation: {
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
          toggleErrorModal();
          invalidateQueriesAfterSuccessfulUpdate();
        },
        meta: {
          disableGlobalNotification: true,
        },
      },
    });

  const { mutate: updateSeniorImage, isPending: isUpdateUserImagePending } =
    useAdminInstitutionControllerUploadImageForSenior({
      mutation: {
        onSuccess: invalidateQueriesAfterSuccessfulUpdate,
      },
    });

  const { mutate: deleteUserImage } = useAdminInstitutionControllerDeleteUserImage({
    mutation: {
      onSuccess: () => invalidateQueriesAfterSuccessfulUpdate,
    },
  });

  const onSubmit: SubmitHandler<SeniorFormData> = ({
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
    updateSeniorBasicInfo({
      userId: seniorIdNumber,
      data: {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth?.toISOString(),
        email_address: emailAddress || undefined!,
        phone_number: phoneNumber,
      },
    });

    const hasUploadedUserImageBefore = Boolean(image);

    if (hasUploadedUserImageBefore && !file) {
      deleteUserImage({
        seniorId: seniorIdNumber,
      });

      return;
    }

    const selectedFile = file?.originFileObj;

    if (selectedFile) {
      updateSeniorImage({
        seniorId: seniorIdNumber,
        data: {
          file: selectedFile,
        },
      });
    }

    updateSeniorDetails({
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
  };

  useEffect(() => {
    if (image) {
      setFile({
        uid: '-1',
        name: 'avatar.jpeg',
        status: 'done',
        size: image.length,
        url: `data:image/jpeg;base64,${image}`,
      });
    }
  }, [setFile, image]);

  return (
    <>
      <StyledCard title={t('admin_title_senior_details')} className={styles.form} shadow>
        <Form layout="horizontal" autoComplete="off">
          <Row>
            <Col>
              <FormItem
                name="firstName"
                label={t('admin_form_first_name')}
                required
                {...inputCommonProps}
              >
                <Input className={styles.inputWide} />
              </FormItem>
              <FormItem
                name="lastName"
                label={t('admin_form_last_name')}
                required
                {...inputCommonProps}
              >
                <Input className={styles.inputWide} />
              </FormItem>
              <FormItem
                name="dateOfBirth"
                label={t('admin_form_date_of_birth')}
                required
                {...inputCommonProps}
              >
                <DatePicker
                  placeholder={t('admin_form_select_date')}
                  format={TimeFormat.DATE_FORMAT}
                  className={styles.inputShort}
                  {...inputCommonProps}
                />
              </FormItem>
              <FormItem
                name="phoneNumber"
                label={t('shared_form_phone_number')}
                required
                {...inputCommonProps}
              >
                <PhoneNumberInput className={styles.inputWide} />
              </FormItem>
              <FormItem name="emailAddress" label={t('shared_form_email')} {...inputCommonProps}>
                <Input className={styles.inputWide} />
              </FormItem>
            </Col>
            <Col span={2} offset={3}>
              <FormItem name="avatar" control={control}>
                <AvatarUpload onFileChange={setFile} defaultFile={file} placeholderSize="small" />
              </FormItem>
            </Col>
          </Row>
          <Title level={6} className={styles.addressTitle}>
            {t('admin_inf_address')}
          </Title>
          <Row>
            <Col>
              <FormItem name="city" label={t('admin_form_city')} {...inputCommonProps}>
                <Input className={styles.inputWide} />
              </FormItem>
              <FormItem name="street" label={t('admin_form_street')} {...inputCommonProps}>
                <Input className={styles.inputWide} />
              </FormItem>
              <FormItem name="building" label={t('admin_form_building')} {...inputCommonProps}>
                <Input className={styles.inputShort} />
              </FormItem>
              <FormItem name="flat" label={t('admin_form_flat')} {...inputCommonProps}>
                <Input className={styles.inputShort} />
              </FormItem>
              <FormItem
                label={t('admin_form_zip_code')}
                name="zipCode"
                help={errors.zipCode?.message}
                {...inputCommonProps}
              >
                <MaskedInput
                  maskFunction={val => formatNumbersOnly(val, true)}
                  className={styles.inputShort}
                />
              </FormItem>
              <FormItem
                name="additionalInfo"
                label={t('admin_form_additional_info')}
                {...inputCommonProps}
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
        </Form>
        <FormControls
          confirmButtonText={t('shared_btn_save_changes')}
          onSubmit={handleSubmit(onSubmit)}
          containerClassName={styles.buttonContainer}
          loading={
            isUpdatingSeniorBasicInfo || isAddingUserAddressPending || isUpdateUserImagePending
          }
        />
      </StyledCard>
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
    </>
  );
};

export default DetailsTab;
