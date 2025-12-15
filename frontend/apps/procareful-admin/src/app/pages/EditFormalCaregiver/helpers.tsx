import type { TableProps } from 'antd';
import { RoleDtoRoleName, type UserWithAdminsDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { Text } from '@Procareful/ui';

export const columnsData: TableProps<UserWithAdminsDto>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_senior');
    },
    key: 'fullName',
    width: '50%',
    render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_informal_caregiver');
    },
    key: 'role',
    width: '50%',
    render: (_, { admins }) => {
      const informalCaregiver = admins.find(admin =>
        admin.roles.some(role => role.role_name === RoleDtoRoleName.informalCaregiver)
      );

      if (!informalCaregiver) {
        return <Text>{i18n.t('admin_table_no_informal_caregiver_yet')}</Text>;
      }

      const informalCaregiverNames = `${informalCaregiver.first_name} ${informalCaregiver.last_name}`;

      return <Text strong>{informalCaregiverNames}</Text>;
    },
  },
];
