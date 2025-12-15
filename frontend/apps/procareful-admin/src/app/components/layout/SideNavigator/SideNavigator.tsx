import Icon from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  type AdminRolesDto,
  AdminRolesDtoRoleName,
  useAppControllerGetAppVersion,
} from '@Procareful/common/api';
import { Text } from '@Procareful/ui';
import LogoSvg from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import NavigationLink from './NavigationLink';
import { navigationRoutes } from './constants';
import { useStyles } from './styles';

const { Sider } = Layout;

const APP_FE_VERSION = import.meta.env.VITE_APP_VERSION;

type SideNavigatorProps = {
  userRoles?: AdminRolesDto[];
};

const SideNavigator = ({ userRoles }: SideNavigatorProps) => {
  const { styles, cx } = useStyles();
  const [clickCount, setClickCount] = useState(0);
  const [showVersionInfo, setShowVersionInfo] = useState(false);

  const { data: versionData } = useAppControllerGetAppVersion<{ version: string }>({ request: {} });

  const isUserHeadAdmin = verifyAccessByRole(AdminRolesDtoRoleName.headAdmin, userRoles);

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);

    if (clickCount + 1 === 10) {
      setShowVersionInfo(true);
    }
  };

  const handleRenderLogo = () => {
    if (showVersionInfo) {
      return (
        <div className={styles.versionContainer}>
          <Text>FE: v.{APP_FE_VERSION}</Text>
          <Text>BE: v.{versionData?.version}</Text>
        </div>
      );
    }

    return (
      <Link to={PathRoutes.Dashboard}>
        <Icon component={LogoSvg} className={styles.logoIcon} />
        {!isUserHeadAdmin && <Text className={styles.logoText}>Procareful</Text>}
      </Link>
    );
  };

  useEffect(() => {
    if (clickCount === 0) return;

    const timer = setTimeout(() => {
      setClickCount(0);
    }, 250);

    return () => clearTimeout(timer);
  }, [clickCount]);

  return (
    <Sider
      className={cx(styles.sider, {
        [styles.adminSider]: isUserHeadAdmin,
      })}
    >
      <div
        className={cx(styles.logoContainer, {
          [styles.adminLogoContainer]: isUserHeadAdmin,
        })}
        onClick={handleLogoClick}
      >
        {handleRenderLogo()}
      </div>
      <ul>
        {!isUserHeadAdmin &&
          navigationRoutes.map((route, index) => (
            <NavigationLink
              key={index}
              route={route}
              hasAccess={verifyAccessByRole(route.access, userRoles)}
            />
          ))}
      </ul>
    </Sider>
  );
};
export default SideNavigator;
