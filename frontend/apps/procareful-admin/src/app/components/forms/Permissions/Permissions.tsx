import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Select } from 'antd';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import PromptModal from '@ProcarefulAdmin/components/PromptModal';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import { roles } from '@ProcarefulAdmin/constants/roles';
import { permissionSchema } from '@ProcarefulAdmin/utils';
import {
  getAdminInstitutionControllerGetFormalCaregiverQueryKey,
  getAdminInstitutionControllerGetInstitutionAdminQueryKey,
  UpdateInstitutionAdminRoleDtoRoleToAssign,
  UpdateInstitutionAdminRoleDtoRoleToRemove,
  useAdminInstitutionControllerUpdateRoles,
  type UpdateInstitutionAdminRoleDto,
} from '@Procareful/common/api';
import {
  type Key,
  useNotificationContext,
  useToggle,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { permissionsItems } from './constants';
import { useStyles } from './styles';

type PermissionsData = z.infer<typeof permissionSchema>;

type PermissionsProps = PermissionsData & {
  adminId: number;
  isDisabled?: boolean;
};

const Permissions = ({
  permissions: currentPermissions,
  adminId,
  isDisabled = false,
}: PermissionsProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isAssignPermissionModalOpen, , setAssignPermissionModalVisibility] = useToggle();
  const [isAssignPermissionDeclinedModalOpen, , setAssignPermissionDeclinedModalVisibility] =
    useToggle();
  const [rolePayload, setRolePayload] = useState<UpdateInstitutionAdminRoleDto>();
  const [shouldRedirectAfterRoleChange, setShouldRedirectAfterRoleChange] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<PermissionsData>({
    resolver: zodResolver(permissionSchema),
    values: { permissions: currentPermissions },
  });

  const { mutate: updateAdminRole, isPending: isUpdateAdminRolePending } =
    useAdminInstitutionControllerUpdateRoles({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetInstitutionAdminQueryKey(adminId),
          });

          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetFormalCaregiverQueryKey(adminId, {
              page: 1,
              pageSize: PaginationSize.Small,
            }),
          });

          notificationApi.success({
            message: t('admin_title_assign_caregiver_permission_success'),
          });

          if (shouldRedirectAfterRoleChange) {
            navigate(-1);

            return;
          }

          setAssignPermissionModalVisibility(false);
        },
      },
    });

  const showModal = (iRemovingFormalCaregiverRole: boolean) => {
    const shouldBlockFormalCaregiverPermissionRemoval = isDisabled && iRemovingFormalCaregiverRole;

    shouldBlockFormalCaregiverPermissionRemoval
      ? setAssignPermissionDeclinedModalVisibility(true)
      : setAssignPermissionModalVisibility(true);
  };

  const handleRoleChange = (shouldRedirect: boolean, payload: UpdateInstitutionAdminRoleDto) => {
    setShouldRedirectAfterRoleChange(shouldRedirect);
    setRolePayload(payload);
    showModal(payload?.roleToRemove === UpdateInstitutionAdminRoleDtoRoleToRemove.formalCaregiver);
  };
  const onSubmit: SubmitHandler<PermissionsData> = ({ permissions: selectedPermissions }) => {
    if (!isDirty) {
      notificationApi.success({
        message: t('admin_title_assign_caregiver_permission_success'),
      });

      return;
    }

    const hasFormalCaregiver = currentPermissions.includes(
      UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver
    );
    const hasAdminInstitution = currentPermissions.includes(
      UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution
    );

    const isAddingFormalCaregiver = selectedPermissions.includes(
      UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver
    );
    const isAddingAdminInstitution = selectedPermissions.includes(
      UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution
    );

    const isFormalCaregiverEdit = pathname.includes(PathRoutes.FormalCaregiverEdit);
    const isEditInstitutionAdmin = pathname.includes(PathRoutes.EditInstitutionAdmin);

    // 1. Handle case where user has both roles and we are removing one or both
    if (hasFormalCaregiver && hasAdminInstitution) {
      // Remove only Admin Institution, keep Formal Caregiver as is
      if (!isAddingAdminInstitution && isAddingFormalCaregiver === hasFormalCaregiver) {
        handleRoleChange(isEditInstitutionAdmin, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.adminInstitution,
        });

        return;
      }

      // Remove only Formal Caregiver, keep Admin Institution as is
      if (!isAddingFormalCaregiver && isAddingAdminInstitution === hasAdminInstitution) {
        handleRoleChange(isFormalCaregiverEdit, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.formalCaregiver,
        });

        return;
      }

      // Switch from FC to IA
      if (!isAddingFormalCaregiver && isAddingAdminInstitution) {
        handleRoleChange(isEditInstitutionAdmin, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.formalCaregiver,
          roleToAssign: UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution,
        });

        return;
      }

      // Switch from IA to FC
      if (!isAddingAdminInstitution && isAddingFormalCaregiver) {
        handleRoleChange(isFormalCaregiverEdit, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.adminInstitution,
          roleToAssign: UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver,
        });

        return;
      }

      return;
    }

    // 2. Handle case where user is FC and we want to switch to IA
    if (hasFormalCaregiver && !hasAdminInstitution) {
      // Switch from FC to IA (remove FC, add IA)
      if (!isAddingFormalCaregiver && isAddingAdminInstitution) {
        handleRoleChange(isFormalCaregiverEdit, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.formalCaregiver,
          roleToAssign: UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution,
        });

        return;
      }

      // Add Admin Institution, keep Formal Caregiver as is
      if (isAddingAdminInstitution && isAddingFormalCaregiver === hasFormalCaregiver) {
        handleRoleChange(false, {
          roleToAssign: UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution,
        });

        return;
      }

      // Remove Formal Caregiver, do not add Admin Institution
      if (!isAddingFormalCaregiver && !isAddingAdminInstitution) {
        handleRoleChange(isFormalCaregiverEdit, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.formalCaregiver,
        });

        return;
      }

      return;
    }

    // 3. Handle case where user is IA and we want to switch to FC
    if (!hasFormalCaregiver && hasAdminInstitution) {
      // Switch from IA to FC (remove IA, add FC)
      if (!isAddingAdminInstitution && isAddingFormalCaregiver) {
        handleRoleChange(isEditInstitutionAdmin, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.adminInstitution,
          roleToAssign: UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver,
        });

        return;
      }

      // Add Formal Caregiver, keep Admin Institution as is
      if (isAddingFormalCaregiver && isAddingAdminInstitution === hasAdminInstitution) {
        handleRoleChange(false, {
          roleToAssign: UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver,
        });

        return;
      }

      // Remove Admin Institution, do not add Formal Caregiver
      if (!isAddingAdminInstitution && !isAddingFormalCaregiver) {
        handleRoleChange(isEditInstitutionAdmin, {
          roleToRemove: UpdateInstitutionAdminRoleDtoRoleToRemove.adminInstitution,
        });

        return;
      }

      return;
    }
  };

  const handleModalConfirm = () => {
    if (!rolePayload) {
      return;
    }

    updateAdminRole({
      adminId,
      data: rolePayload,
    });
  };

  const renderRoles = (permissions: UpdateInstitutionAdminRoleDtoRoleToAssign[]) =>
    permissions?.map(permission => t(roles[permission] as Key)).join(', ');

  const permissions = watch('permissions');

  return (
    <StyledCard
      title={t('admin_title_permissions')}
      subtitle={t('admin_inf_permissions_subtitle')}
      className={styles.cardContainer}
    >
      <Form layout="horizontal" className={styles.form}>
        <FormItem
          control={control}
          name="permissions"
          label={t('admin_title_permissions')}
          wrapperCol={{ span: 8 }}
        >
          <Select
            placeholder={t('admin_btn_select')}
            options={permissionsItems.map(o => ({ ...o, label: t(o.label as Key) }))}
            className={styles.select}
            mode="multiple"
          />
        </FormItem>
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} />
      </Form>
      <PromptModal
        open={isAssignPermissionModalOpen}
        type="warning"
        title={t('admin_title_assign_caregiver_permission')}
        notificationContent={{
          header: t('admin_inf_assign_caregiver_permission_subtitle'),
          description: t('admin_inf_assign_caregiver_permission_description'),
        }}
        confirmButtonType="primary"
        onConfirm={handleModalConfirm}
        onCancel={() => setAssignPermissionModalVisibility(false)}
        cancelButtonText={t('shared_btn_cancel')}
        confirmButtonText={t('admin_btn_confirm_change')}
        isLoading={isUpdateAdminRolePending}
      >
        <div className={styles.newRolesContainer}>
          <div className={styles.roleDataContainer}>
            <Text>{t('admin_inf_current_permission')}</Text>
            <Text strong>{renderRoles(currentPermissions)}</Text>
          </div>
          <div className={styles.roleDataContainer}>
            <Text>{t('admin_inf_new_permission')}</Text>
            <Text strong>{renderRoles(permissions)}</Text>
          </div>
        </div>
      </PromptModal>
      <PromptModal
        open={isAssignPermissionDeclinedModalOpen}
        type="warning"
        title={t('admin_title_assign_caregiver_permission_removal_declined')}
        notificationContent={{
          header: t('admin_inf_assign_caregiver_permission_removal_declined_subtitle'),
          description: t('admin_inf_assign_caregiver_permission_removal_declined_description'),
        }}
        onConfirm={() => setAssignPermissionDeclinedModalVisibility(false)}
        onCancel={() => setAssignPermissionDeclinedModalVisibility(false)}
        showCancelButton={false}
        confirmButtonText={t('shared_btn_ok')}
        className={styles.modalContainer}
      />
    </StyledCard>
  );
};

export default Permissions;
