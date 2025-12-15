import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { type SubmitHandler, useForm, Controller } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useSearchParams } from 'react-router-dom';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { List, Modal, Form, Input, Checkbox, Select } from 'antd';
import type { FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import ListFooterButton from '@ProcarefulAdmin/components/ListFooterButton';
import { sortByInformalCaregiver } from '@ProcarefulAdmin/pages/SeniorProfile/helpers';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { type SupportingContactUserModalData } from '@ProcarefulAdmin/typings';
import { addSupportingContactsSchema } from '@ProcarefulAdmin/utils';
import {
  useCaregiverControllerAddSupportingContact,
  useCaregiverControllerGetSupportingContact,
  useCaregiverControllerUpdateSupportingContact,
  getCaregiverControllerGetSupportingContactQueryKey,
  useCaregiverControllerDeleteSupportingContact,
  useCaregiverControllerGetUser,
  useCaregiverControllerCheckIfInformalCaregiverExists,
  AddSupportingContactDtoRelationItem,
  ContactRelationRelations,
  type GetSupportingContactDto,
  type GetUserInfoDtoAddress,
  type ErrorResponse,
  useCaregiverControllerAssignInformalCaregiverAsSupportingContactToSenior,
} from '@Procareful/common/api';
import {
  setBackendFieldErrors,
  toCamelCase,
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
  formatNumbersOnly,
} from '@Procareful/common/lib';
import { PhoneNumberInput, Title, Spinner, MaskedInput } from '@Procareful/ui';
import AssignCaregiverModal from './AssignCaregiverModal';
import CaregiverAlreadyExistModal from './CaregiverAlreadyExistModal';
import RemoveContactModal from './RemoveContactModal';
import {
  MAX_SUPPORTING_CONTACTS_COUNT,
  defaultFormValues,
  type SupportingContactsData,
} from './constants';
import { getSeniorRelationOptions, renderListItems } from './helpers';
import { useStyles } from './styles';

type Address = Omit<GetUserInfoDtoAddress, 'id' | 'additional_info'>;
export type AddedSupportingContactsData = SupportingContactsData & {
  id: string;
};

const AddSupportingContacts = () => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const [isContactModalOpen, , setContactModalVisibility] = useToggle();
  const [isRemoveModalOpen, , setRemoveModalVisibility] = useToggle();
  const [isCaregiverExistModalOpen, , setCaregiverExistModalVisibility] = useToggle();
  const [isAssignCaregiverModalOpen, , setAssignCaregiverModalVisibility] = useToggle();

  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [fetchedInformalCaregiver, setFetchedInformalCaregiver] =
    useState<SupportingContactUserModalData | null>(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { notificationApi } = useNotificationContext();

  const seniorId = searchParams.get(SearchParams.Id);
  const isEditMode = Boolean(selectedContactId);

  const { data: seniorData } = useCaregiverControllerGetUser(Number(seniorId));
  const seniorAddress = seniorData?.details?.address;

  const { building, city, flat, street, zip_code } = seniorAddress || {};
  const isSeniorAddressProvided = Boolean(building || city || flat || street || zip_code);

  const handleSuccessAddOrUpdateSupportingContacts = () => {
    queryClient.invalidateQueries({
      queryKey: getCaregiverControllerGetSupportingContactQueryKey(Number(seniorId)),
    });
    setSelectedContactId(null);
    setContactModalVisibility(false);
  };
  const {
    data: { details: supportingContactsData } = {},
    isLoading: isLoadingSupportingContacts,
    isRefetching: isRefetchingSupportingContacts,
  } = useCaregiverControllerGetSupportingContact(Number(seniorId));

  const sortedContacts = useMemo(
    () => sortByInformalCaregiver(supportingContactsData),
    [supportingContactsData]
  );

  const selectedSupportingContact = useMemo(
    () => supportingContactsData?.find(({ contact }) => contact.id === selectedContactId) || null,
    [supportingContactsData, selectedContactId]
  );
  const { contact: selectedContactData, address: selectedAddressData } =
    selectedSupportingContact || {};

  const handleBackendErrors = (error: ErrorResponse) => setBackendFieldErrors(error, setError);

  const { mutate: addSupportingContact, isPending: isAddingSupportingContact } =
    useCaregiverControllerAddSupportingContact({
      mutation: {
        onSuccess: () => {
          handleSuccessAddOrUpdateSupportingContacts();
          setAssignCaregiverModalVisibility(false);
          notificationApi.success({
            message: t('admin_title_supporting_contact_added'),
            description: t('admin_inf_supporting_contact_saved_subtitle'),
          });
        },
        onError: handleBackendErrors,
      },
    });

  const { mutate: updateSupportingContact, isPending: isUpdatingSupportingContact } =
    useCaregiverControllerUpdateSupportingContact({
      mutation: {
        onSuccess: () => {
          handleSuccessAddOrUpdateSupportingContacts();
          notificationApi.success({
            message: t('admin_title_supporting_contact_updated'),
            description: t('admin_inf_supporting_contact_saved_subtitle'),
          });
        },
        onError: handleBackendErrors,
      },
    });

  const { mutate: deleteSupportingContact, isPending: isDeletingSupportingContact } =
    useCaregiverControllerDeleteSupportingContact({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetSupportingContactQueryKey(Number(seniorId)),
          });
          setSelectedContactId(null);
          setRemoveModalVisibility(false);
          notificationApi.success({
            message: t('admin_title_supporting_contact_removed'),
            description: t('admin_form_alert_successfully_removed_data'),
          });
        },
      },
    });

  const { mutateAsync: checkIfInformalCaregiverExist, isPending: isCheckingInformalExistence } =
    useCaregiverControllerCheckIfInformalCaregiverExists();

  const { mutate: assignExistingInformalCaregiver } =
    useCaregiverControllerAssignInformalCaregiverAsSupportingContactToSenior({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getCaregiverControllerGetSupportingContactQueryKey(Number(seniorId)),
          });
          setCaregiverExistModalVisibility(false);
          notificationApi.success({
            message: t('admin_title_supporting_contact_added'),
            description: t('admin_inf_supporting_contact_saved_subtitle'),
          });
        },
      },
    });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<SupportingContactsData>({
    resolver: zodResolver(addSupportingContactsSchema),
    defaultValues: defaultFormValues,
  });

  const relationshipToSenior = watch('relation');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const emailAddress = watch('emailAddress');
  const phoneNumber = watch('phoneNumber');

  const userCurrentData = {
    firstName: firstName || '',
    lastName: lastName || '',
    emailAddress: emailAddress || '',
    phoneNumber: phoneNumber || '',
  };

  const addressFields = watch(['city', 'street', 'building', 'flat', 'zipCode']);
  const addressSameAsSenior = watch('addressSameAsSenior');

  const shouldDisableInformalCaregiverRelation =
    Boolean(
      supportingContactsData?.some(
        ({ contact }) =>
          contact.id !== selectedContactData?.id &&
          contact?.relation?.some(
            relation => relation.relations === ContactRelationRelations.informalCaregiver
          )
      )
    ) &&
    !selectedContactData?.relation?.some(
      relation => relation.relations === ContactRelationRelations.informalCaregiver
    );

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 9 },
    labelAlign: 'left' as FormLabelAlign,
    hasFeedback: true,
  };

  const handleEditOrRemoveSupportingContact = (id: number, action: 'edit' | 'remove') => {
    setSelectedContactId(id);

    action === 'edit' ? setContactModalVisibility(true) : setRemoveModalVisibility(true);
  };

  const onSubmit: SubmitHandler<SupportingContactsData> = async ({
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
    city,
    flat,
    building,
    street,
    zipCode,
    addressSameAsSenior,
    relation,
  }) => {
    const isDuplicatePhone = supportingContactsData?.some(
      ({ contact }) => contact.phone_number === phoneNumber && contact.id !== selectedContactId
    );

    const isDuplicateEmail =
      emailAddress &&
      supportingContactsData?.some(
        ({ contact }) => contact.email_address === emailAddress && contact.id !== selectedContactId
      );

    if (isDuplicatePhone) {
      setError('phoneNumber', {
        type: 'manual',
        message: t('admin_form_phone_number_exist'),
      });
    }

    if (isDuplicateEmail) {
      setError('emailAddress', {
        type: 'manual',
        message: t('admin_form_email_exist'),
      });
    }

    if (isDuplicatePhone || isDuplicateEmail) {
      return;
    }

    const payloadBase = {
      userId: Number(seniorId),
      data: {
        contactId: Number(selectedContactData?.id),
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_address: emailAddress || undefined,
        relation,
        address_same_as_senior: addressSameAsSenior,
        address: {
          city,
          flat,
          building,
          street,
          zip_code: zipCode,
        },
      },
    };

    const isAddingInformalCaregiver = relation.includes(
      AddSupportingContactDtoRelationItem.informalCaregiver
    );

    const isPreviousRelationValueInformalCaregiver =
      selectedSupportingContact?.contact.relation?.find(
        relation => relation.relations === ContactRelationRelations.informalCaregiver
      );

    const isUpdatingInformalCaregiver = Boolean(
      isPreviousRelationValueInformalCaregiver && isAddingInformalCaregiver
    );

    if (isAddingInformalCaregiver && !isUpdatingInformalCaregiver) {
      const response = await checkIfInformalCaregiverExist({
        data: {
          phone_number: phoneNumber,
        },
      });

      const existingInformalCaregiverData = response?.details;

      if (!existingInformalCaregiverData) {
        if (isEditMode) {
          updateSupportingContact({ ...payloadBase, contactId: Number(selectedContactData?.id) });

          return;
        }

        setContactModalVisibility(false);
        setAssignCaregiverModalVisibility(true);

        return;
      }

      const { email_address, first_name, last_name, phone_number, id } =
        existingInformalCaregiverData || {};

      setFetchedInformalCaregiver({
        emailAddress: email_address,
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phone_number,
        id,
      });
      setContactModalVisibility(false);
      setCaregiverExistModalVisibility(true);

      return;
    }

    if (isEditMode) {
      updateSupportingContact({ ...payloadBase, contactId: Number(selectedContactData?.id) });

      return;
    }

    addSupportingContact(payloadBase);
  };

  const handleCancelAssignCaregiverConfirmation = () => {
    setAssignCaregiverModalVisibility(false);
    setContactModalVisibility(true);
  };

  const handleAssignCaregiverConfirmation = async () => {
    const {
      firstName,
      lastName,
      phoneNumber,
      emailAddress,
      relation,
      addressSameAsSenior,
      city,
      flat,
      building,
      street,
      zipCode,
    } = getValues();

    const payloadBase = {
      userId: Number(seniorId),
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email_address: emailAddress || undefined,
        relation,
        address_same_as_senior: addressSameAsSenior,
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
      ? updateSupportingContact({
          ...payloadBase,
          contactId: Number(selectedContactData?.id),
        })
      : addSupportingContact(payloadBase);

    setAssignCaregiverModalVisibility(false);
  };

  const handleConfirmRemove = () => {
    const contactId = selectedContactData?.id;

    if (contactId) {
      deleteSupportingContact({
        userId: Number(seniorId),
        contactId,
      });
    }
  };

  const handleCloseContactModal = () => {
    setSelectedContactId(null);
    clearErrors();
    setContactModalVisibility(false);
  };

  const handleAddContact = () => {
    setSelectedContactId(null);
    reset(defaultFormValues);
    setContactModalVisibility(true);
  };

  const handleCancelRemoveModal = () => {
    clearErrors();
    setRemoveModalVisibility(false);
    setSelectedContactId(null);
  };

  const handleCancelCaregiverAlreadyExistModal = () => {
    setCaregiverExistModalVisibility(false);
    setContactModalVisibility(true);
  };

  const handleAddressSameAsSeniorChange = (checked: boolean) => {
    if (!seniorAddress) {
      return;
    }

    if (!isSeniorAddressProvided) {
      setError('addressSameAsSenior', {
        type: 'manual',
        message: t('admin_alert_senior_address_not_provided'),
      });

      setValue('addressSameAsSenior', false);

      return;
    }

    const fieldNames = Object.keys(seniorAddress) as Array<keyof Address>;

    fieldNames.forEach(fieldName => {
      const camelCasedFieldName = toCamelCase(fieldName as string) as keyof SupportingContactsData;
      const value = seniorAddress[fieldName];

      if (typeof value !== 'string' && typeof value !== 'undefined') {
        return;
      }

      if (checked) {
        setValue(camelCasedFieldName, value);
      } else {
        setValue(camelCasedFieldName, selectedAddressData?.[fieldName]);
      }
    });
  };

  const handleInformalCaregiverExistModalConfirm = async () => {
    const caregiverId = fetchedInformalCaregiver?.id;

    if (!caregiverId) {
      return;
    }

    assignExistingInformalCaregiver({
      caregiverId,
      userId: Number(seniorId),
    });
  };

  useDeepCompareEffect(() => {
    if (selectedSupportingContact) {
      const updateValues = (
        data: GetSupportingContactDto['address'] | GetSupportingContactDto['contact'],
        fieldNames: Array<string>
      ) => {
        fieldNames.forEach(field => {
          const camelCasedFieldName = toCamelCase(field) as keyof SupportingContactsData;
          const value = data[field as keyof typeof data];

          if (
            typeof value === 'string' ||
            typeof value === 'undefined' ||
            typeof value === 'boolean'
          ) {
            setValue(camelCasedFieldName, value);
          }
        });
      };

      // Update contact fields
      if (selectedContactData) {
        const contactFieldNames = Object.keys(selectedContactData) as Array<
          keyof GetSupportingContactDto['contact']
        >;
        updateValues(selectedContactData, contactFieldNames);
      }

      // Update address fields
      if (selectedAddressData) {
        const addressFieldNames = Object.keys(selectedAddressData) as Array<
          keyof GetSupportingContactDto['address']
        >;
        updateValues(selectedAddressData, addressFieldNames);
      }

      // Handle the relation field separately if it exists
      const selectedContactRelation = selectedContactData?.relation;
      if (selectedContactRelation?.length) {
        setValue(
          'relation',
          selectedContactRelation.map(
            relation => relation.relations as unknown as AddSupportingContactDtoRelationItem
          )
        );
      }
    }
  }, [selectedSupportingContact, selectedAddressData, selectedContactData, setValue]);

  useEffect(() => {
    if (!seniorAddress || !isSeniorAddressProvided) {
      return;
    }

    const { additional_info, id, ...seniorAddressData } = seniorAddress;
    const fieldNames = Object.keys(seniorAddressData) as Array<keyof Address>;

    const isAddressSame = fieldNames.every(
      (fieldName, index) => addressFields[index] === seniorAddressData[fieldName]
    );

    if (!isAddressSame && addressSameAsSenior) {
      setValue('addressSameAsSenior', false);
    } else if (isAddressSame && !addressSameAsSenior) {
      setValue('addressSameAsSenior', true);
    }
  }, [addressFields, addressSameAsSenior, seniorAddress, isSeniorAddressProvided, setValue]);

  useDeepCompareEffect(() => {
    if (errors.addressSameAsSenior?.message) {
      clearErrors('addressSameAsSenior');
    }
  }, [addressFields]);

  const isContactModalLoading =
    isAddingSupportingContact || isUpdatingSupportingContact || isCheckingInformalExistence;

  const hasMaximumNumberOfSupportingContacts = Boolean(
    supportingContactsData?.length === MAX_SUPPORTING_CONTACTS_COUNT
  );

  if (isLoadingSupportingContacts) {
    return <Spinner />;
  }

  return (
    <>
      <List
        className={styles.list}
        size="large"
        bordered
        dataSource={sortedContacts}
        locale={{ emptyText: <div></div> }}
        footer={
          !hasMaximumNumberOfSupportingContacts && (
            <ListFooterButton onClick={handleAddContact}>
              {t('admin_title_add_contact')}
            </ListFooterButton>
          )
        }
        renderItem={item => renderListItems(item.contact, handleEditOrRemoveSupportingContact)}
        // @ts-expect-error Backend sends every field as possibly undefined but it shouldn't
        rowKey={({ contact }) => contact.id}
        loading={isRefetchingSupportingContacts}
      />
      <AssignCaregiverModal
        open={isAssignCaregiverModalOpen}
        onConfirm={handleAssignCaregiverConfirmation}
        onCancel={handleCancelAssignCaregiverConfirmation}
        userData={userCurrentData}
        loading={isAddingSupportingContact}
      />
      {fetchedInformalCaregiver && (
        <CaregiverAlreadyExistModal
          open={isCaregiverExistModalOpen}
          onConfirm={handleInformalCaregiverExistModalConfirm}
          onCancel={handleCancelCaregiverAlreadyExistModal}
          userData={fetchedInformalCaregiver}
          loading={false}
        />
      )}
      <RemoveContactModal
        open={isRemoveModalOpen}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemoveModal}
        loading={isDeletingSupportingContact}
        userData={userCurrentData}
      />
      <Modal
        title={
          isEditMode
            ? t('admin_title_edit_supporting_contact')
            : t('admin_title_supporting_contact')
        }
        open={isContactModalOpen}
        okText={t('shared_btn_save')}
        onCancel={handleCloseContactModal}
        maskClosable={false}
        keyboard={false}
        footer={
          <FormControls
            confirmButtonText={t('shared_btn_save')}
            resetButtonText={t('shared_btn_cancel')}
            onReset={handleCloseContactModal}
            loading={isContactModalLoading}
            onSubmit={handleSubmit(onSubmit)}
          />
        }
      >
        <Form layout="horizontal" autoComplete="off">
          <FormItem
            name="firstName"
            label={t('admin_form_first_name')}
            {...formItemCommonProps}
            required
          >
            <Input />
          </FormItem>
          <FormItem
            name="lastName"
            label={t('admin_form_last_name')}
            {...formItemCommonProps}
            required
          >
            <Input />
          </FormItem>
          <FormItem
            name="relation"
            label={t('admin_form_relationship_to_senior')}
            required
            {...formItemCommonProps}
          >
            <Select
              mode="multiple"
              className={styles.select}
              placeholder={t('admin_form_select')}
              options={getSeniorRelationOptions(shouldDisableInformalCaregiverRelation)}
            />
          </FormItem>
          <Title level={6} className={stylish.formTitle}>
            {t('admin_inf_contact_info')}
          </Title>
          <FormItem
            name="phoneNumber"
            label={t('shared_form_phone_number')}
            {...formItemCommonProps}
            required
          >
            <PhoneNumberInput />
          </FormItem>
          <FormItem
            name="emailAddress"
            label={t('shared_form_email')}
            required={relationshipToSenior?.includes(
              AddSupportingContactDtoRelationItem.informalCaregiver
            )}
            {...formItemCommonProps}
          >
            <Input />
          </FormItem>
          <Title level={6} className={stylish.formTitle}>
            {t('admin_inf_address')}
          </Title>
          <Form.Item
            hasFeedback
            validateStatus={errors.addressSameAsSenior?.message && 'error'}
            help={errors.addressSameAsSenior?.message}
            className={styles.checkbox}
            valuePropName="checked"
          >
            <Controller
              control={control}
              name="addressSameAsSenior"
              render={({ field: { onChange, value, ref } }) => (
                <Checkbox
                  onChange={e => {
                    handleAddressSameAsSeniorChange(e.target.checked);
                    isSeniorAddressProvided && onChange(e);
                  }}
                  checked={value}
                  ref={ref}
                >
                  {t('admin_inf_same_as_senior')}
                </Checkbox>
              )}
            />
          </Form.Item>
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

export default AddSupportingContacts;
