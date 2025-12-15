import Icon from '@ant-design/icons';
import { type ReactNode } from 'react';
import { Title } from '@Procareful/ui';
import LogoSvg from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import { useStyles } from './styles';

type HeaderProps = {
  className?: string;
  children: ReactNode;
  withoutTitle?: boolean;
};

const Header = ({ className, children, withoutTitle = false }: HeaderProps) => {
  const { styles, cx } = useStyles();

  return (
    <div className={cx(styles.headerContainer, className)}>
      <div className={styles.logoContainer}>
        <Icon component={LogoSvg} className={styles.icon} />
        {!withoutTitle && (
          <Title level={6} className={styles.procareful}>
            Procareful
          </Title>
        )}
      </div>
      <Title level={3} className={styles.title}>
        {children}
      </Title>
    </div>
  );
};

export default Header;
