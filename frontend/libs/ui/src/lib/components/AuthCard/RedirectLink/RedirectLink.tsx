import { type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { useStyles } from './styles';

type RedirectLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  underline?: boolean;
};

const RedirectLink = ({
  children,
  underline = true,
  className,
  ...otherProps
}: RedirectLinkProps) => {
  const { styles, cx } = useStyles({ underline });

  return (
    <Link className={cx(styles.redirectLink, className)} {...otherProps}>
      {children}
    </Link>
  );
};

export default RedirectLink;
