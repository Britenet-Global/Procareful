import { Dropdown, List, type MenuProps, type SelectProps } from 'antd';
import { cx } from 'antd-style';
import { seniorRelationMap } from '@ProcarefulAdmin/constants/supportingContactRelationMap';
import { styles } from '@ProcarefulAdmin/styles/supportingContacts';
import {
  AddSupportingContactDtoRelationItem,
  type GetSupportingContactDto,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { Text } from '@Procareful/ui';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

export const getSeniorRelationOptions = (
  shouldDisableInformalCaregiver: boolean
): SelectProps['options'] => [
  {
    get label() {
      return i18n.t('admin_title_informal_caregiver');
    },
    value: AddSupportingContactDtoRelationItem.informalCaregiver,
    disabled: shouldDisableInformalCaregiver,
  },
  {
    get label() {
      return i18n.t('admin_title_emergency_contact');
    },
    value: AddSupportingContactDtoRelationItem.emergencyContact,
  },
  {
    get label() {
      return i18n.t('admin_title_legal_representative');
    },
    value: AddSupportingContactDtoRelationItem.legalRepresentative,
  },
  {
    get label() {
      return i18n.t('admin_title_caregiver_role_other');
    },
    value: AddSupportingContactDtoRelationItem.other,
  },
];

export const renderListItems = (
  { id, first_name, last_name, relation }: GetSupportingContactDto['contact'],
  actionCallback: (id: number, action: 'edit' | 'remove') => void
) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      get label() {
        return i18n.t('shared_btn_edit');
      },
      onClick: () => id && actionCallback(id, 'edit'),
    },
    {
      key: '2',
      danger: true,
      get label() {
        return i18n.t('admin_btn_remove');
      },
      onClick: () => id && actionCallback(id, 'remove'),
    },
  ];

  return (
    <List.Item>
      <div className={cx(styles.listItemContainer)}>
        <Text strong>
          {first_name} {last_name}
        </Text>
        <Text className={cx(styles.paragraphMark)}>
          {relation?.map(relation => seniorRelationMap[relation.relations]).join(', ')}
        </Text>
      </div>
      <Dropdown
        align={{ offset: [30, -20] }}
        placement="bottomLeft"
        menu={{ items }}
        trigger={['click']}
      >
        <div className={cx(styles.itemActions)}>
          <MoreHoriz />
        </div>
      </Dropdown>
    </List.Item>
  );
};
