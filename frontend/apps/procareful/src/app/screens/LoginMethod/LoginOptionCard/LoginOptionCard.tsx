import { Paragraph, Title } from '@Procareful/ui';
import { type ElementType } from 'react';
import { useStyles } from './styles';

type LoginOptionCardProps = {
  title: string;
  subtitle: string;
  icon: ElementType;
};

const LoginOptionCard = ({ title, subtitle, icon: Icon }: LoginOptionCardProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Title level={5} className={styles.title}>
          {title}
        </Title>
        <Icon className={styles.icon} />
      </div>
      <Paragraph className={styles.subtitle}>{subtitle}</Paragraph>
    </div>
  );
};

export default LoginOptionCard;
