import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { useStyles } from './styles';

const { Content } = Layout;

export const AuthLayout = () => {
  const { styles } = useStyles();

  return (
    <Layout className={styles.container}>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};
