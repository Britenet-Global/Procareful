import { useQueryClient } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import TopBar from '@ProcarefulAdmin/components/layout/TopBar';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  useAdminInstitutionControllerGetAdminImage,
  AdminRolesDtoRoleName,
} from '@Procareful/common/api';
import SideNavigator from '../SideNavigator';
import { useStyles } from './styles';

const { Content, Header } = Layout;

const MainLayout = () => {
  const { styles } = useStyles();
  const queryClient = useQueryClient();

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );
  const { first_name, roles } = userData?.details.admin || {};

  const { data: userImageData } = useAdminInstitutionControllerGetAdminImage({
    query: {
      enabled: !verifyAccessByRole(AdminRolesDtoRoleName.headAdmin, roles),
    },
  });

  return (
    <Layout className={styles.container}>
      <SideNavigator userRoles={roles} />
      <Layout>
        <Header className={styles.headerContainer}>
          <TopBar firstName={first_name} roles={roles} avatar={userImageData?.details} />
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
