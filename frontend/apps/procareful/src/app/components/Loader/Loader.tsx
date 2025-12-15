import { useTypedTranslation } from '@Procareful/common/lib';
import { Title } from '@Procareful/ui';
import Logo from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import Icon from '@ant-design/icons';
import { Spin } from 'antd';
import { useStyles } from './styles';

const Loader = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div>
        <Icon component={Logo} className={styles.logoIcon} />
        <Title level={1} className={styles.logoText}>
          {t('admin_title_procareful')}
        </Title>
      </div>
      <Spin size="large" className={styles.spinner} />
    </div>
  );
};

export default Loader;
