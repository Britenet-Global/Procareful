import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, List, Modal } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import ListFooterButton from '@ProcarefulAdmin/components/ListFooterButton';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { familyDoctorSchema } from '@ProcarefulAdmin/utils';
import {
  getCaregiverControllerGetFamilyDoctorQueryKey,
  useCaregiverControllerAddFamilyDoctor,
  useCaregiverControllerGetFamilyDoctor,
  useCaregiverControllerDeleteFamilyDoctorContact,
  useCaregiverControllerUpdateFamilyDoctor,
  type GetFamilyDoctorDto,
  type ErrorResponse,
} from '@Procareful/common/api';
import {
  formatPhoneToDisplay,
  toCamelCase,
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
  formatNumbersOnly,
} from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { MaskedInput, PhoneNumberInput, Text, Title } from '@Procareful/ui';
import { type FamilyDoctorData, defaultFormValues } from './constants';
import { renderListItems } from './helpers';
import { useStyles } from './styles';

export type AddedFamilyContactsData = FamilyDoctorData & {
  id: string;
};

const FamilyDoctor = () => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const [isContactModalOpen, toggleContactModal] = useToggle();
  const [isRemoveModalOpen, toggleRemoveModal] = useToggle();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { notificationApi } = useNotificationContext();

  const seniorId = searchParams.get(SearchParams.Id);

  const handleBackendErrors = (error: ErrorResponse) => setBackendFieldErrors(error, setError);

  const handleSuccessAddOrUpdateFamilyDoctor = () => {
    queryClient.invalidateQueries({
      queryKey: getCaregiverControllerGetFamilyDoctorQueryKey(Number(seniorId)),
    });
    toggleContactModal();
  };

  const { mutate: addFamilyDoctor, isPending: isAddingFamilyDoctor } =
    useCaregiverControllerAddFamilyDoctor({
      mutation: {
        onSuccess: () => {
          handleSuccessAddOrUpdateFamilyDoctor();
          notificationApi.success({
            message: t('admin_title_family_doctor_added'),
            description: t('admin_inf_family_doctor_subtitle'),
          });
        },
        onError: handleBackendErrors,
      },
    });

  const { mutate: updateFamilyDoctor, isPending: isUpdatingFamilyDoctor } =
    useCaregiverControllerUpdateFamilyDoctor({
      mutation: {
        onSuccess: () => {
          handleSuccessAddOrUpdateFamilyDoctor();
          notificationApi.success({
            message: t('admin_title_family_doctor_updated'),
            description: t('admin_inf_family_doctor_subtitle'),
          });
        },
        onError: handleBackendErrors,
      },
    });

  const { mutate: deleteFamilyDoctor, isPending: isDeletingFormalDoctor } =
    useCaregiverControllerDeleteFamilyDoctorContact({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetFamilyDoctorQueryKey(Number(seniorId)),
          });
          reset(defaultFormValues);
          notificationApi.success({
            message: t('admin_title_family_doctor_removed'),
            description: t('admin_form_alert_successfully_removed_data'),
          });
          toggleRemoveModal();
        },
      },
    });

  const { data: familyDoctorData, isRefetching: isRefetchingFamilyDoctor } =
    useCaregiverControllerGetFamilyDoctor(Number(seniorId), {});

  const { address: familyDoctorAddressData, contact: familyDoctorContactData } =
    familyDoctorData?.details?.[0] || {};
  const { first_name, last_name, phone_number, email_address } = familyDoctorContactData || {};
  const isEditMode = Boolean(familyDoctorAddressData);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FamilyDoctorData>({
    resolver: zodResolver(familyDoctorSchema),
    defaultValues: defaultFormValues,
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 9 },
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const handleEditOrRemoveSupportingContact = (action: 'edit' | 'remove') => {
    action === 'edit' ? toggleContactModal() : toggleRemoveModal();
  };

  const onSubmit: SubmitHandler<FamilyDoctorData> = ({
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
    city,
    flat,
    building,
    street,
    zipCode,
  }) => {
    const isEditMode = Boolean(familyDoctorContactData);

    const payloadBase = {
      userId: Number(seniorId),
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_address: emailAddress,
        address: {
          city,
          flat,
          building,
          street,
          zip_code: zipCode,
        },
      },
    };

    isEditMode
      ? updateFamilyDoctor({ ...payloadBase, contactId: Number(familyDoctorContactData?.id) })
      : addFamilyDoctor(payloadBase);
  };

  const handleConfirmRemove = () => {
    const contactId = familyDoctorContactData?.id;

    if (contactId) {
      deleteFamilyDoctor({
        userId: Number(seniorId),
        contactId,
      });
    }
  };

  const handleCancelContactModal = () => {
    clearErrors();
    toggleContactModal();
  };

  useEffect(() => {
    if (familyDoctorContactData || familyDoctorAddressData) {
      const updateValues = (
        data: GetFamilyDoctorDto['address'] | GetFamilyDoctorDto['contact'],
        fieldNames: Array<string>
      ) => {
        fieldNames.forEach(field => {
          const camelCasedFieldName = toCamelCase(field) as keyof FamilyDoctorData;
          const value = data[field as keyof typeof data];

          if (typeof value === 'string' || typeof value === 'undefined') {
            setValue(camelCasedFieldName, value);
          }
        });
      };

      if (familyDoctorContactData) {
        const contactFieldNames = Object.keys(familyDoctorContactData) as Array<
          keyof GetFamilyDoctorDto['contact']
        >;
        updateValues(familyDoctorContactData, contactFieldNames);
      }

      if (familyDoctorAddressData) {
        const addressFieldNames = Object.keys(familyDoctorAddressData) as Array<
          keyof GetFamilyDoctorDto['address']
        >;
        updateValues(familyDoctorAddressData, addressFieldNames);
      }
    }
  }, [familyDoctorContactData, familyDoctorAddressData, setValue]);

  return (
    <>
      <List
        className={styles.list}
        size="large"
        bordered
        dataSource={familyDoctorData?.details as GetFamilyDoctorDto[]}
        locale={{ emptyText: <div></div> }}
        footer={
          !familyDoctorContactData && (
            <ListFooterButton
              onClick={toggleContactModal}
              disabled={Boolean(familyDoctorContactData)}
            >
              {t('admin_title_add_family_doctor')}
            </ListFooterButton>
          )
        }
        renderItem={item => renderListItems(item.contact, handleEditOrRemoveSupportingContact)}
        loading={isRefetchingFamilyDoctor}
      />
      <PromptModal
        title={t('admin_title_are_you_sure_you_want_to_remove')}
        open={isRemoveModalOpen}
        onConfirm={handleConfirmRemove}
        onCancel={toggleRemoveModal}
        confirmButtonText={t('admin_btn_remove')}
        confirmButtonType="primary"
        confirmButtonDanger
        isLoading={isDeletingFormalDoctor}
      >
        <div className={styles.removeUserDataContainer}>
          <Text strong>
            {first_name} {last_name}
          </Text>
          {phone_number && <Text>{formatPhoneToDisplay(phone_number)}</Text>}
          <Text>{email_address}</Text>
        </div>
      </PromptModal>

      <Modal
        title={
          isEditMode ? t('admin_title_edit_family_doctor') : t('admin_title_add_family_doctor')
        }
        open={isContactModalOpen}
        onCancel={toggleContactModal}
        maskClosable={false}
        keyboard={false}
        footer={
          <FormControls
            confirmButtonText={t('shared_btn_save')}
            resetButtonText={t('shared_btn_cancel')}
            onReset={handleCancelContactModal}
            loading={isAddingFamilyDoctor || isUpdatingFamilyDoctor}
            onSubmit={handleSubmit(onSubmit)}
          />
        }
      >
        <Form layout="horizontal" autoComplete="off" onFinish={handleSubmit(onSubmit)}>
          <FormItem
            name="firstName"
            label={t('admin_form_first_name')}
            required
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <FormItem
            name="lastName"
            label={t('admin_form_last_name')}
            required
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <FormItem
            name="phoneNumber"
            label={t('shared_form_phone_number')}
            required
            {...formItemCommonProps}
          >
            <PhoneNumberInput />
          </FormItem>
          <FormItem name="emailAddress" label={t('shared_form_email')} {...formItemCommonProps}>
            <Input />
          </FormItem>
          <Title level={6} className={stylish.formTitle}>
            {t('admin_title_practice_address')}
          </Title>
          <FormItem
            name="city"
            label={t('admin_form_city')}
            wrapperCol={{ span: 17 }}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <FormItem
            name="street"
            label={t('admin_form_street')}
            wrapperCol={{ span: 17 }}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <FormItem
            name="building"
            label={t('admin_form_building')}
            wrapperCol={{ span: 8 }}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <FormItem
            name="flat"
            label={t('admin_form_flat')}
            wrapperCol={{ span: 8 }}
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
        </Form>
      </Modal>
    </>
  );
};

export default FamilyDoctor;
