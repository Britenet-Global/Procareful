import { Link } from 'react-router-dom';
import { Button, Upload, type UploadProps } from 'antd';
import type { TableHeaderButtonProps } from '@ProcarefulAdmin/typings';
import { useStyles } from './styles';

type HeaderButtonProps = {
  buttonMenu?: TableHeaderButtonProps;
};

const uploadProps: UploadProps = {
  name: 'file',
  showUploadList: false,
};

const HeaderButton = ({ buttonMenu }: HeaderButtonProps) => {
  const { styles, cx } = useStyles();

  if (!buttonMenu) {
    return null;
  }

  const { title, buttonType = 'default', navigateTo, ...restProps } = buttonMenu;

  if (buttonType === 'upload') {
    return (
      <Upload {...uploadProps}>
        <Button className={cx(styles.button, buttonMenu.className)} {...restProps}>
          {title}
        </Button>
      </Upload>
    );
  }

  if (buttonType === 'link' && navigateTo) {
    return (
      <Link to={navigateTo}>
        <Button className={cx(styles.button, buttonMenu.className)} {...restProps}>
          {title}
        </Button>
      </Link>
    );
  }

  return (
    <Button className={cx(styles.button, buttonMenu.className)} {...restProps}>
      {title}
    </Button>
  );
};

export default HeaderButton;
