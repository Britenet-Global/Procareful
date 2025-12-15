import { Spin } from 'antd';
import { useStyles } from './styles';

type CenteredSpinnerProps = {
  size?: 'small' | 'default' | 'large';
};

const CenteredSpinner = ({ size }: CenteredSpinnerProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.spinnerContainer}>
      <Spin size={size} />
    </div>
  );
};

export default CenteredSpinner;
