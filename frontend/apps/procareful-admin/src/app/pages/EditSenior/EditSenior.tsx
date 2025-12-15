import { keepPreviousData, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import UserStatus from '@ProcarefulAdmin/components/UserStatus';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type { PaginationTableProps, TableHeaderButtonProps } from '@ProcarefulAdmin/typings';
import {
  type StatusStatusName,
  useAdminInstitutionControllerGetUserById,
  useAdminInstitutionControllerSetUserStatus,
  SetStatusDtoStatus,
  getAdminInstitutionControllerGetUserByIdQueryKey,
  type GetCaregiverDto,
  type AdminInstitutionControllerGetUserByIdParams,
  getAdminInstitutionControllerGetUsersQueryKey,
  useAdminInstitutionControllerDeleteUser,
  useAdminInstitutionControllerRemoveFormalCaregiverSeniorAssignment,
  getAdminInstitutionControllerGetFormalCaregiversAvailableForUserQueryKey,
  useAdminInstitutionControllerGetFormalCaregiversAvailableForUser,
  type GetInformalCaregiversDto,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AssignFormalCaregiverModal from './AssignFormalCaregiverModal';
import BasicInfo from './BasicInfo';
import UserContact from './UserContact';
import { FORMAL_CAREGIVERS_PAGINATION_PARAMS } from './constants';
import { getColumnData } from './helpers';
import { useStyles } from './styles';

const EditSenior = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const seniorId = Number(searchParams.get(SearchParams.Id));
  const [isAssignFormalCaregiverModalOpen, toggleAssignFormalCaregiverModal] = useToggle(false);
  const [isRemoveCaregiverAssignmentModalOpen, , setRemoveCaregiverAssignmentModalVisibility] =
    useToggle(false);
  const [
    isRemoveCaregiverAssignmentDeclinedModalOpen,
    ,
    setRemoveCaregiverAssignmentDeclinedModalVisibility,
  ] = useToggle(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<GetCaregiverDto>();

  const {
    filters: { page },
    handleFilterChange,
  } = useTableFilter<AdminInstitutionControllerGetUserByIdParams>({
    page: 1,
  });

  const {
    data: seniorsData,
    isLoading,
    isRefetching,
  } = useAdminInstitutionControllerGetUserById(
    seniorId,
    {
      page,
      pageSize: PaginationSize.Small,
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const { senior, address } = seniorsData?.details || {};
  const {
    first_name,
    last_name,
    email_address,
    date_of_birth,
    phone_number,
    status: statusData,
    admins,
  } = senior || {};
  const fullName = `${first_name} ${last_name}`;
  const { city, street, building, flat, zip_code } = address || {};

  const { data: caregiversData } = useAdminInstitutionControllerGetFormalCaregiversAvailableForUser(
    seniorId,
    FORMAL_CAREGIVERS_PAGINATION_PARAMS,
    {
      query: {
        enabled: Boolean(seniorId),
      },
    }
  );
  const availableCaregivers = caregiversData?.details?.items as GetInformalCaregiversDto[];
  const formalCaregivers = admins?.items || [];

  const { mutate: deleteSenior, isPending: isSeniorDeletePending } =
    useAdminInstitutionControllerDeleteUser({
      mutation: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetUsersQueryKey({
              page: 1,
              pageSize: PaginationSize.Large,
            }),
          });

          notificationApi.success({
            message: t('admin_title_senior_removed'),
            description: t('admin_inf_senior_removed'),
          });

          navigate(PathRoutes.InstitutionUsers);
        },
      },
    });
  const { mutate: removeCaregiverAssignment, isPending: isRemoveCaregiverAssignmentPending } =
    useAdminInstitutionControllerRemoveFormalCaregiverSeniorAssignment({
      mutation: {
        onSuccess: () => {
          setRemoveCaregiverAssignmentModalVisibility(false);
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetUserByIdQueryKey(seniorId, {
              page,
              pageSize: PaginationSize.Small,
            }),
          });

          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetFormalCaregiversAvailableForUserQueryKey(
              seniorId,
              FORMAL_CAREGIVERS_PAGINATION_PARAMS
            ),
          });

          notificationApi.success({
            message: t('admin_alert_assignment_removed_title'),
            description: (
              <Trans>
                {t('admin_alert_assignment_removed_subtitle', {
                  seniorName: fullName,
                  caregiverName: `${selectedCaregiver?.first_name} ${selectedCaregiver?.last_name}`,
                })}
              </Trans>
            ),
          });
        },
      },
    });

  const handleRemoveAssignmentClick = (rowData: GetCaregiverDto) => {
    setSelectedCaregiver(rowData);
    formalCaregivers?.length === 1
      ? setRemoveCaregiverAssignmentDeclinedModalVisibility(true)
      : setRemoveCaregiverAssignmentModalVisibility(true);
  };

  const { mutate: updateSeniorStatus } = useAdminInstitutionControllerSetUserStatus({
    mutation: {
      onSuccess: (_, { data }) => {
        if (data.status === SetStatusDtoStatus.inactive) {
          notificationApi.success({
            message: t('admin_title_senior_deactivated'),
            description: t('admin_inf_senior_deactivated'),
          });
        }
        if (data.status === SetStatusDtoStatus.active) {
          notificationApi.success({
            message: t('admin_title_senior_activate'),
            description: t('admin_inf_user_activated'),
          });
        }
        queryClient.invalidateQueries({
          queryKey: getAdminInstitutionControllerGetUserByIdQueryKey(seniorId, {
            page,
            pageSize: PaginationSize.Small,
          }),
        });
      },
    },
  });

  const handleChangeSeniorStatus = (status: SetStatusDtoStatus) => {
    updateSeniorStatus({
      seniorId,
      data: {
        status,
      },
    });
  };

  const handleDeleteSeniorConfirmation = () => {
    deleteSenior({
      userId: seniorId,
    });
  };

  const handleRemoveCaregiverAssignment = () => {
    const caregiverId = selectedCaregiver?.id;

    if (!caregiverId) {
      return;
    }

    removeCaregiverAssignment({
      caregiverId: selectedCaregiver?.id,
      seniorId,
    });
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: admins?.pagination?.totalItems,
    pageSize: PaginationSize.Small,
    onChange: handleFilterChange('page'),
  };

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_btn_assign_caregiver'),
    icon: <PersonAddAltIcon />,
    onClick: toggleAssignFormalCaregiverModal,
    className: availableCaregivers?.length === 0 ? styles.buttonHidden : undefined,
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <BasicInfo
        firstName={first_name || ''}
        lastName={last_name || ''}
        dateOfBirth={date_of_birth ? dayjs(date_of_birth) : undefined}
        seniorId={seniorId}
      />
      <UserContact
        phoneNumber={phone_number || ''}
        emailAddress={email_address || ''}
        city={city || ''}
        street={street || ''}
        building={building || ''}
        flat={flat || ''}
        zipCode={zip_code || ''}
        seniorId={seniorId}
      />
      <TableLayout
        dataSource={formalCaregivers}
        loading={isLoading || isRefetching}
        columns={getColumnData(handleRemoveAssignmentClick)}
        pagination={paginationConfig}
        rowKey={record => record.id}
        tableHeader={
          <TableHeader title={t('admin_title_formal_caregivers')} buttonMenu={buttonMenu} />
        }
      />

      <StyledCard title={t('admin_title_user_status')}>
        <UserStatus
          userDetails={{
            name: fullName,
            status: statusData?.status_name as unknown as StatusStatusName,
          }}
          onDeactivationConfirm={() => handleChangeSeniorStatus(SetStatusDtoStatus.inactive)}
          onDeletionConfirm={handleDeleteSeniorConfirmation}
          onActivate={() => handleChangeSeniorStatus(SetStatusDtoStatus.active)}
          loading={isSeniorDeletePending}
        />
      </StyledCard>
      <AssignFormalCaregiverModal
        seniorId={seniorId}
        isOpen={isAssignFormalCaregiverModalOpen}
        onSuccess={toggleAssignFormalCaregiverModal}
        onCancel={toggleAssignFormalCaregiverModal}
        caregivers={availableCaregivers}
      />
      <PromptModal
        open={isRemoveCaregiverAssignmentModalOpen}
        type="warning"
        confirmButtonType="primary"
        onConfirm={handleRemoveCaregiverAssignment}
        onCancel={() => setRemoveCaregiverAssignmentModalVisibility(false)}
        loading={isRemoveCaregiverAssignmentPending}
        title={t('admin_alert_remove_assignment')}
        notificationContent={{
          header: t('admin_alert_remove_assignment_title'),
          description: t('admin_alert_remove_assignment_subtitle'),
        }}
        confirmButtonText={t('admin_btn_remove_assignment')}
      />
      <PromptModal
        open={isRemoveCaregiverAssignmentDeclinedModalOpen}
        type="warning"
        onConfirm={() => setRemoveCaregiverAssignmentDeclinedModalVisibility(false)}
        onCancel={() => setRemoveCaregiverAssignmentDeclinedModalVisibility(false)}
        loading={isRemoveCaregiverAssignmentPending}
        title={t('admin_alert_remove_assignment_declined_title')}
        notificationContent={{
          description: t('admin_alert_remove_assignment_declined_subtitle'),
        }}
        confirmButtonText={t('shared_btn_ok')}
        showCancelButton={false}
        confirmButtonType="default"
      />
    </div>
  );
};

export default EditSenior;
