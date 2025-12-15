import { Dropdown, List, type MenuProps } from 'antd';
import { cx } from 'antd-style';
import { styles } from '@ProcarefulAdmin/styles/supportingContacts';
import { type GetFamilyDoctorDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { Text } from '@Procareful/ui';
import MoreHoriz from '@mui/icons-material/MoreHoriz';

export const renderListItems = (
  { first_name, last_name }: GetFamilyDoctorDto['contact'],
  actionCallback: (action: 'edit' | 'remove') => void
) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      get label() {
        return i18n.t('shared_btn_edit');
      },
      onClick: () => actionCallback('edit'),
    },
    {
      key: '2',
      danger: true,
      get label() {
        return i18n.t('admin_btn_remove');
      },
      onClick: () => actionCallback('remove'),
    },
  ];

  return (
    <List.Item>
      <div className={cx(styles.listItemContainer)}>
        <Text strong>
          {first_name} {last_name}
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
