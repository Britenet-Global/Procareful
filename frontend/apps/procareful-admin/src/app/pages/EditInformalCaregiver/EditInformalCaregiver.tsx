import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import UserStatus from '@ProcarefulAdmin/components/UserStatus';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type { PaginationTableProps } from '@ProcarefulAdmin/typings';
import {
  type StatusStatusName,
  useAdminInstitutionControllerGetInformalCaregiver,
  useAdminInstitutionControllerSetCaregiverStatus,
  SetStatusDtoStatus,
  getAdminInstitutionControllerGetInformalCaregiverQueryKey,
  RoleDtoRoleName,
  useAdminInstitutionControllerDeleteCaregiver,
  getAdminInstitutionControllerGetInformalCaregiversQueryKey,
  type AdminInstitutionControllerGetInformalCaregiverParams,
  InformalCaregiverStatusStatusName,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import BasicInfo from './BasicInfo';
import CaregiverContact from './CaregiverContact';
import { columnsData } from './helpers';
import { useStyles } from './styles';

const EditInformalCaregiver = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { notificationApi } = useNotificationContext();
  const [searchParams] = useSearchParams();
  const caregiverId = Number(searchParams.get(SearchParams.Id));
  const queryClient = useQueryClient();

  const {
    filters: { page },
    handleFilterChange,
  } = useTableFilter<AdminInstitutionControllerGetInformalCaregiverParams>({ page: 1 });

  const paginationParams = { page, pageSize: PaginationSize.Small };

  const { data, isLoading } = useAdminInstitutionControllerGetInformalCaregiver(
    caregiverId,
    paginationParams
  );

  const { address, informalCaregiver } = data?.details || {};
  const {
    users,
    first_name: firstName,
    last_name: lastName,
    email_address: emailAddress,
    phone_number: phoneNumber,
    roles,
    status,
  } = informalCaregiver || {};

  const fullCaregiverName = `${firstName} ${lastName}`;
  const { building, flat, street, zip_code, city } = address || {};

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
          queryKey: getAdminInstitutionControllerGetInformalCaregiverQueryKey(
            caregiverId,
            paginationParams
          ),
        });
      },
    },
  });

  const { mutate: deleteCaregiver, isPending: isDeleteCaregiverPending } =
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
      caregiverId,
      caregiverRole: RoleDtoRoleName.informalCaregiver,
      data: {
        status,
      },
    });
  };

  const handleDeleteCaregiverConfirmation = () => {
    deleteCaregiver({ caregiverId, caregiverRole: RoleDtoRoleName.informalCaregiver });
  };

  const handleUpdateDataSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: getAdminInstitutionControllerGetInformalCaregiverQueryKey(
        caregiverId,
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
    total: users?.pagination?.totalItems,
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
        caregiverId={caregiverId}
        onSuccess={handleUpdateDataSuccess}
      />
      <TableLayout
        dataSource={users?.items}
        columns={columnsData}
        pagination={paginationConfig}
        rowKey={record => record.id}
        tableHeader={<TableHeader title={t('admin_title_assigned_seniors')} />}
      />
      <CaregiverContact
        phoneNumber={phoneNumber || ''}
        emailAddress={emailAddress || ''}
        street={street || ''}
        building={building || ''}
        flat={flat || ''}
        city={city || ''}
        zipCode={zip_code || ''}
        caregiverId={caregiverId}
        onSuccess={handleUpdateDataSuccess}
        showResendRegistrationLinkButton={
          status?.status_name === InformalCaregiverStatusStatusName.created
        }
      />
      <StyledCard title={t('admin_title_user_status')}>
        <UserStatus
          userDetails={{
            name: fullCaregiverName,
            roles,
            status: status?.status_name as unknown as StatusStatusName,
          }}
          onActivate={() => handleChangeCaregiverStatus(SetStatusDtoStatus.active)}
          onDeactivationConfirm={() => handleChangeCaregiverStatus(SetStatusDtoStatus.inactive)}
          onDeletionConfirm={handleDeleteCaregiverConfirmation}
          loading={isDeleteCaregiverPending}
        />
      </StyledCard>
    </div>
  );
};

export default EditInformalCaregiver;
