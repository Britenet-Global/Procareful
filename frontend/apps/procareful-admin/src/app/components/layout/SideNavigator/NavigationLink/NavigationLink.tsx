import { NavLink } from 'react-router-dom';
import { type NavigationRoute } from '@ProcarefulAdmin/typings';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type NavigationLinkProps = {
  hasAccess?: boolean;
  route: NavigationRoute;
};

const NavigationLink = ({ route, hasAccess = false }: NavigationLinkProps) => {
  const { path, title, icon: Icon } = route;
  const { styles } = useStyles();

  if (!hasAccess) {
    return null;
  }

  return (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) => (isActive ? styles.itemContainerActive : styles.itemContainer)}
      >
        <Icon className={styles.itemIcon} />
        <Text className={styles.itemText}>{title}</Text>
      </NavLink>
    </li>
  );
};

export default NavigationLink;
