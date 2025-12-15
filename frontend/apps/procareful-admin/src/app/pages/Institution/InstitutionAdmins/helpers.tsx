import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { tagColor, tagStatus } from '@ProcarefulAdmin/constants/tagStatus';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  AdminRolesDtoRoleName,
  type GetMeResponseDto,
  type GetInstitutionAdminsDto,
  getAuthControllerGetMeQueryKey,
  RoleDtoRoleName,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { formatPhoneToDisplay, SearchParams } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useStyles } from './styles';

type InstitutionAdmins = RoleDtoRoleName.adminInstitution | RoleDtoRoleName.superAdminInstitution;

const tagRole: Record<InstitutionAdmins, string> = {
  get [RoleDtoRoleName.adminInstitution]() {
    return i18n.t('admin_form_label_admin');
  },
  get [RoleDtoRoleName.superAdminInstitution]() {
    return i18n.t('admin_form_label_super_admin');
  },
};

export const useInstitutionAdminsData = () => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();
  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const hasUserEditPermission = verifyAccessByRole(
    AdminRolesDtoRoleName.superAdminInstitution,
    userData?.details.admin.roles
  );

  const columnData: TableProps<GetInstitutionAdminsDto>['columns'] = [
    {
      get title() {
        return i18n.t('admin_table_name');
      },
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
    },
    {
      get title() {
        return i18n.t('admin_table_email_address');
      },
      dataIndex: 'email_address',
      key: 'email_address',
      width: '30%',
    },
    {
      get title() {
        return i18n.t('admin_table_phone_number');
      },
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '18%',
      render: (_, { phone_number }) => <Text>{formatPhoneToDisplay(phone_number)}</Text>,
    },
    {
      get title() {
        return i18n.t('admin_table_role');
      },
      dataIndex: 'role',
      key: 'role',
      width: '15%',

      render: (_, { roles }) =>
        roles
          // We don't want to display formal caregiver role on this screen even if it's IA/FC
          .filter(role => role.role_name !== RoleDtoRoleName.formalCaregiver)
          .map(role => {
            const roleName = role.role_name as InstitutionAdmins;

            return (
              <Tag key={role.id} className={styles.tag}>
                {tagRole[roleName]}
              </Tag>
            );
          }),
    },
    {
      title: i18n.t('admin_table_status'),
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (_, { status }) => {
        if (!status?.status_name) {
          return null;
        }

        return (
          <Tag customColor={tagColor[status.status_name]}>{tagStatus[status.status_name]}</Tag>
        );
      },
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      width: '5%',
      render: (_, { id }) => {
        if (!hasUserEditPermission || !id) {
          return null;
        }

        const navigationConfig = {
          pathname: PathRoutes.EditInstitutionAdmin,
          search: new URLSearchParams({
            [SearchParams.Id]: id.toString(),
          }).toString(),
        };

        return (
          <div className={styles.editIconContainer}>
            <Link to={navigationConfig}>
              <EditOutlinedIcon className={styles.editIcon} />
            </Link>
          </div>
        );
      },
    },
  ];

  return { columnData, hasUserEditPermission };
};
