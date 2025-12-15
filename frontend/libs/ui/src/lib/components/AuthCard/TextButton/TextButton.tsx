import { type ReactNode } from 'react';
import { Button, type ButtonProps } from 'antd';
import { useStyles } from './styles';

type TextButtonProps = ButtonProps & {
  className?: string;
  children: ReactNode;
};

const TextButton = ({ className, children, ...otherProps }: TextButtonProps) => {
  const { styles, cx } = useStyles();

  return (
    <Button type="text" className={cx(styles.textButton, className)} {...otherProps}>
      {children}
    </Button>
  );
};

export default TextButton;
