import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import UserStatus from '@ProcarefulAdmin/components/UserStatus';
import Permissions from '@ProcarefulAdmin/components/forms/Permissions';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import {
  type StatusStatusName,
  useAdminInstitutionControllerGetInstitutionAdmin,
  useAdminInstitutionControllerSetAdminsInstitutionStatus,
  useAdminInstitutionControllerDeleteAdminsInstitution,
  SetStatusDtoStatus,
  getAdminInstitutionControllerGetInstitutionAdminQueryKey,
  getAdminInstitutionControllerGetAllAdminsInstitutionQueryKey,
  type UpdateInstitutionAdminRoleDtoRoleToAssign,
  GetInstitutionAdminDtoStatusStatusName,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import BasicInfo from './BasicInfo';
import UserContact from './UserContact';
import { useStyles } from './styles';

const EditInstitutionAdmin = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const adminId = Number(searchParams.get(SearchParams.Id));

  const { data, isLoading } = useAdminInstitutionControllerGetInstitutionAdmin(adminId);

  const {
    first_name: firstName,
    last_name: lastName,
    email_address: emailAddress,
    phone_number: phoneNumber,
    status,
    roles,
    assignedUsers,
  } = data?.details || {};

  const fullAdminName = `${firstName} ${lastName}`;
  const adminRoles =
    roles?.map(role => role.role_name as unknown as UpdateInstitutionAdminRoleDtoRoleToAssign) ||
    [];

  const { mutate: updateAdminStatus, isPending: isInstitutionDeletePending } =
    useAdminInstitutionControllerSetAdminsInstitutionStatus({
      mutation: {
        onSuccess: async (_, { data }) => {
          await queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetInstitutionAdminQueryKey(adminId),
          });

          if (data.status === SetStatusDtoStatus.inactive) {
            notificationApi.success({
              message: t('admin_title_admin_deactivate'),
              description: t('admin_inf_institution_admin_deactivated'),
            });
          }
          if (data.status === SetStatusDtoStatus.active) {
            notificationApi.success({
              message: t('admin_title_admin_activate'),
              description: t('admin_inf_institution_admin_activated'),
            });
          }
        },
      },
    });

  const { mutate: deleteAdmin } = useAdminInstitutionControllerDeleteAdminsInstitution({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminInstitutionControllerGetAllAdminsInstitutionQueryKey(),
        });

        notificationApi.success({
          message: t('admin_title_admin_removed'),
          description: t('admin_inf_user_removed'),
        });

        navigate(PathRoutes.InstitutionAdmins, { replace: true });
      },
    },
  });

  const handleChangeAdminStatus = (status: SetStatusDtoStatus) => {
    updateAdminStatus({
      adminId,
      data: { status },
    });
  };

  const handleDeleteInstitutionAdminConfirmation = () => {
    deleteAdmin({ adminId });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <BasicInfo firstName={firstName || ''} lastName={lastName || ''} adminId={adminId} />
      <UserContact
        phoneNumber={phoneNumber || ''}
        emailAddress={emailAddress || ''}
        adminId={adminId}
        showResendRegistrationLinkButton={
          status?.status_name === GetInstitutionAdminDtoStatusStatusName.created
        }
      />
      <Permissions permissions={adminRoles} adminId={adminId} isDisabled={assignedUsers} />
      <StyledCard title={t('admin_title_user_status')}>
        <UserStatus
          userDetails={{
            name: fullAdminName,
            roles,
            status: status?.status_name as unknown as StatusStatusName,
          }}
          onActivate={() => handleChangeAdminStatus(SetStatusDtoStatus.active)}
          onDeactivationConfirm={() => handleChangeAdminStatus(SetStatusDtoStatus.inactive)}
          onDeletionConfirm={handleDeleteInstitutionAdminConfirmation}
          loading={isInstitutionDeletePending}
        />
      </StyledCard>
    </div>
  );
};

export default EditInstitutionAdmin;
