import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import UserStatus from '@ProcarefulAdmin/components/UserStatus';
import Permissions from '@ProcarefulAdmin/components/forms/Permissions';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type { PaginationTableProps } from '@ProcarefulAdmin/typings';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  StatusStatusName,
  useAdminInstitutionControllerGetFormalCaregiver,
  type AdminRolesDto,
  SetStatusDtoStatus,
  useAdminInstitutionControllerSetCaregiverStatus,
  getAdminInstitutionControllerGetFormalCaregiverQueryKey,
  useAdminInstitutionControllerDeleteCaregiver,
  RoleDtoRoleName,
  getAdminInstitutionControllerGetInformalCaregiversQueryKey,
  type AdminInstitutionControllerGetFormalCaregiverParams,
  type UpdateInstitutionAdminRoleDtoRoleToAssign,
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  AdminRolesDtoRoleName,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useToggle,
  useTypedTranslation,
  SearchParams,
} from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import BasicInfo from './BasicInfo';
import UserContact from './UserContact';
import { columnsData } from './helpers';
import { useStyles } from './styles';

const EditFormalCaregiver = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDeactivateErrorModalOpen, , setDeactivateErrorModalVisibility] = useToggle(false);

  const formalCaregiverId = Number(searchParams.get(SearchParams.Id));

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isSuperAdmin = verifyAccessByRole(
    AdminRolesDtoRoleName.superAdminInstitution,
    userData?.details.admin.roles
  );

  const {
    filters: { page },
    handleFilterChange,
  } = useTableFilter<AdminInstitutionControllerGetFormalCaregiverParams>({
    page: 1,
    pageSize: PaginationSize.Small,
  });

  const paginationParams = { page, pageSize: PaginationSize.Small };

  const { data, isLoading } = useAdminInstitutionControllerGetFormalCaregiver(
    formalCaregiverId,
    paginationParams
  );

  const { address, formalCaregiver } = data?.details || {};

  const {
    first_name: firstName,
    last_name: lastName,
    roles,
    phone_number: phoneNumber,
    email_address: emailAddress,
    users: assignedSeniors,
  } = formalCaregiver || {};

  const { street, city, building, flat, zip_code: zipCode } = address || {};
  const formalCaregiverStatus = data?.details.formalCaregiver.status
    .status_name as unknown as StatusStatusName;
  const fullName = `${firstName} ${lastName}`;
  const adminRoles =
    roles?.map(role => role.role_name as unknown as UpdateInstitutionAdminRoleDtoRoleToAssign) ||
    [];
  const hasAssignedSeniors = (assignedSeniors?.items?.length ?? 0) > 0;

  const { mutate: updateCaregiverStatus } = useAdminInstitutionControllerSetCaregiverStatus({
    mutation: {
      onSuccess: (_, { data }) => {
        if (data.status === SetStatusDtoStatus.inactive) {
          notificationApi.success({
            message: t('admin_title_caregiver_deactivated'),
            description: t('admin_inf_caregiver_deactivated'),
          });
        }
        if (data.status === SetStatusDtoStatus.active) {
          notificationApi.success({
            message: t('admin_title_caregiver_activate'),
            description: t('admin_inf_user_activated'),
          });
        }
        queryClient.invalidateQueries({
          queryKey: getAdminInstitutionControllerGetFormalCaregiverQueryKey(
            formalCaregiverId,
            paginationParams
          ),
        });
      },
    },
  });

  const { mutate: deleteCaregiver, isPending: isCaregiverDeletePending } =
    useAdminInstitutionControllerDeleteCaregiver({
      mutation: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetInformalCaregiversQueryKey(),
          });

          notificationApi.success({
            message: t('admin_title_caregiver_removed'),
            description: t('admin_inf_user_removed'),
          });

          navigate(PathRoutes.InstitutionUsers);
        },
      },
    });

  const handleChangeCaregiverStatus = (status: SetStatusDtoStatus) => {
    updateCaregiverStatus({
      caregiverId: formalCaregiverId,
      caregiverRole: RoleDtoRoleName.formalCaregiver,
      data: {
        status,
      },
    });
  };

  const handleDeleteCaregiverConfirmation = () => {
    deleteCaregiver({
      caregiverId: formalCaregiverId,
      caregiverRole: RoleDtoRoleName.formalCaregiver,
    });
  };

  const handleUpdateDataSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getAdminInstitutionControllerGetFormalCaregiverQueryKey(
        formalCaregiverId,
        paginationParams
      ),
    });

    notificationApi.success({
      message: t('admin_title_update_successful'),
      description: t('admin_inf_caregiver_updated_subtitle'),
    });
  };

  const paginationConfig: PaginationTableProps = {
    current: paginationParams.page,
    pageSize: paginationParams.pageSize,
    total: data?.details.formalCaregiver.users.pagination?.totalItems,
    onChange: handleFilterChange('page'),
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <BasicInfo
        firstName={firstName || ''}
        lastName={lastName || ''}
        caregiverId={formalCaregiverId}
        onSuccess={handleUpdateDataSuccess}
      />
      <TableLayout
        dataSource={assignedSeniors?.items}
        pagination={paginationConfig}
        columns={columnsData}
        rowKey={record => record.id}
        tableHeader={<TableHeader title={t('admin_title_assigned_seniors')} />}
      />
      <UserContact
        caregiverId={formalCaregiverId}
        phoneNumber={phoneNumber || ''}
        emailAddress={emailAddress || ''}
        street={street || ''}
        building={building || ''}
        flat={flat || ''}
        zipCode={zipCode || ''}
        city={city || ''}
        onSuccess={handleUpdateDataSuccess}
        showResendRegistrationLinkButton={formalCaregiverStatus === StatusStatusName.created}
      />
      {isSuperAdmin && (
        <Permissions
          adminId={formalCaregiverId}
          permissions={adminRoles}
          isDisabled={hasAssignedSeniors}
        />
      )}
      <StyledCard title={t('admin_title_user_status')}>
        <UserStatus
          userDetails={{
            name: fullName || '',
            roles: roles as unknown as AdminRolesDto[],
            status: formalCaregiverStatus,
          }}
          onDeactivationConfirm={() => handleChangeCaregiverStatus(SetStatusDtoStatus.inactive)}
          onDeactivate={
            hasAssignedSeniors ? () => setDeactivateErrorModalVisibility(true) : undefined
          }
          onDeletionConfirm={handleDeleteCaregiverConfirmation}
          onActivate={() => handleChangeCaregiverStatus(SetStatusDtoStatus.active)}
          loading={isCaregiverDeletePending}
        />
      </StyledCard>
      <PromptModal
        open={isDeactivateErrorModalOpen}
        type="warning"
        confirmButtonType="primary"
        showCancelButton={false}
        onConfirm={() => setDeactivateErrorModalVisibility(false)}
        onCancel={() => setDeactivateErrorModalVisibility(false)}
        title={t('admin_alert_cannot_deactivate_user')}
        notificationContent={{
          header: t('admin_alert_cannot_deactivate_user_title'),
          description: t('admin_alert_cannot_deactivate_user_subtitle'),
        }}
        confirmButtonText={t('shared_btn_ok')}
      />
    </div>
  );
};

export default EditFormalCaregiver;
