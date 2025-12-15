import { type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Button } from 'antd';
import { type Key, useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph, Title } from '@Procareful/ui';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useStyles } from './styles';

type BaseInfoTileProps = {
  index?: number;
  title?: string;
  subtitle?: string;
  redirectTo?: LinkProps['to'];
  icon?: ReactNode;
  shadow?: boolean;
  containerStyle?: string;
  variant?: 'link' | 'div' | 'button';
  onClick?: () => void;
  children?: JSX.Element;
};

type InfoTileProps = BaseInfoTileProps &
  (
    | {
        variant: 'link';
        redirectTo: LinkProps['to'];
        icon?: ReactNode;
        onClick?: never;
      }
    | {
        variant: 'div';
        redirectTo?: never;
        icon?: never;
        onClick?: never;
      }
    | {
        variant: 'button';
        redirectTo?: never;
        icon?: ReactNode;
        onClick?: () => void;
      }
  );

const InfoTile = ({
  title,
  subtitle,
  redirectTo,
  index,
  icon: Icon,
  shadow = false,
  containerStyle,
  variant = 'link',
  onClick,
  children,
}: InfoTileProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  const itemContainerClassName = cx(
    styles.itemContainer,
    { [styles.itemContainerWithShadow]: shadow },
    containerStyle
  );

  const commonContent = (
    <>
      {index && <div className={styles.itemIndex}>{index}</div>}
      <div className={styles.textContent}>
        <Title level={5} className={styles.title}>
          {t(title as Key)}
        </Title>
        {subtitle && <Paragraph className={styles.subtitle}>{subtitle}</Paragraph>}
        {children}
      </div>
    </>
  );

  if (variant === 'button') {
    return (
      <Button className={itemContainerClassName} onClick={onClick}>
        {commonContent}
        <div className={styles.iconContainer}>
          {Icon ?? <ChevronRightIcon className={styles.icon} />}
        </div>
      </Button>
    );
  }

  if (variant === 'link' && redirectTo) {
    return (
      <Link to={redirectTo} className={itemContainerClassName}>
        {commonContent}
        <div className={styles.iconContainer}>
          {Icon ?? <ChevronRightIcon className={styles.icon} />}
        </div>
      </Link>
    );
  }

  return <div className={itemContainerClassName}>{commonContent}</div>;
};

export default InfoTile;
