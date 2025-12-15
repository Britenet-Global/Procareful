import { type ReactNode } from 'react';
import { Button, type ButtonProps } from 'antd';
import { useStyles } from './styles';

type SubmitButtonProps = ButtonProps & {
  className?: string;
  children: ReactNode;
  htmlType?: ButtonProps['htmlType'];
};

const SubmitButton = ({
  className,
  children,
  htmlType = 'submit',
  ...otherProps
}: SubmitButtonProps) => {
  const { styles, cx } = useStyles();

  return (
    <Button
      {...otherProps}
      type="primary"
      htmlType={htmlType}
      className={cx(styles.submitButton, className)}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
