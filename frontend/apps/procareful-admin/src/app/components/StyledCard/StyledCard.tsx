import type { ReactNode } from 'react';
import { Card, type CardProps } from 'antd';
import { Paragraph, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type StyledCardProps = CardProps & {
  shadow?: boolean;
  withBorders?: boolean;
  fullHeight?: boolean;
  subtitle?: ReactNode;
  fitContent?: boolean;
  titleContainerClassName?: string;
};

const StyledCard = ({
  children,
  className,
  shadow = true,
  withBorders = false,
  fullHeight = false,
  title,
  subtitle,
  fitContent,
  titleContainerClassName,
  ...restProps
}: StyledCardProps) => {
  const { styles, cx } = useStyles();

  const renderTitleContent = () => {
    if (!title) {
      return null;
    }

    if (typeof title !== 'string') {
      return (
        <div className={cx(styles.titleContainer, titleContainerClassName)}>
          {title}
          {subtitle && <Paragraph>{subtitle}</Paragraph>}
        </div>
      );
    }

    return (
      <div className={cx(styles.titleContainer, titleContainerClassName)}>
        <Title level={5}>{title}</Title>
        {subtitle && <Paragraph>{subtitle}</Paragraph>}
      </div>
    );
  };

  return (
    <Card
      {...restProps}
      className={cx(styles.container, className, {
        [styles.shadow]: shadow,
        [styles.withoutBorders]: !withBorders,
        [styles.containerFullHeight]: fullHeight,
        [styles.containerFitContent]: fitContent,
      })}
      title={renderTitleContent()}
    >
      {children}
    </Card>
  );
};

export default StyledCard;
