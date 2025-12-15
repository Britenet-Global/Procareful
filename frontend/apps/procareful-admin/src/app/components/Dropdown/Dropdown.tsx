import { DownOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown as AntDropdown,
  Space,
  message,
  type MenuProps,
  type DropdownProps as DropdownPropsAnt,
} from 'antd';

type DropdownProps = DropdownPropsAnt & {
  contentContainerStyle?: string;
};

const Dropdown = ({ menu, contentContainerStyle, ...otherProps }: DropdownProps) => {
  const handleMenuClick: MenuProps['onClick'] = () => {
    message.info('Click on menu item.');
  };

  if (!menu) {
    return null;
  }

  const menuProps: MenuProps = {
    items: menu.items,
    onClick: handleMenuClick,
  };

  return (
    <AntDropdown menu={menuProps} {...otherProps}>
      <Button>
        <Space className={contentContainerStyle}>
          {menu.title}
          <DownOutlined />
        </Space>
      </Button>
    </AntDropdown>
  );
};

export default Dropdown;
