import { cx } from 'antd-style';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { styles } from './styles';

export const iconVariants = {
  single: <PersonOutlineOutlinedIcon className={cx(styles.icon)} />,
  double: <PeopleAltOutlinedIcon className={cx(styles.icon)} />,
  multi: <GroupsOutlinedIcon className={cx(styles.icon)} />,
};
