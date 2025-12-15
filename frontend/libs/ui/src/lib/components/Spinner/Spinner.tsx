import { createPortal } from 'react-dom';
import { Spin, type SpinProps as SpinnerProps } from 'antd';
import { useStyles } from './styles';

export const Spinner = ({ size = 'large', ...props }: SpinnerProps) => {
  const { styles } = useStyles();
  const portalContainer = document.getElementById('portal');

  if (!portalContainer) {
    return null;
  }

  const renderSpinnerPortal = createPortal(
    <div className={styles.container}>
      <Spin {...props} size={size} />
    </div>,
    portalContainer
  );

  return renderSpinnerPortal;
};
