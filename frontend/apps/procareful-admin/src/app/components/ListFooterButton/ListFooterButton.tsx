import { type PropsWithChildren } from 'react';
import { Button } from 'antd';
import { Text } from '@Procareful/ui';
import AddIcon from '@mui/icons-material/Add';
import { useStyles } from './styles';

type ListFooterButtonProps = PropsWithChildren & {
  onClick: () => void;
  disabled?: boolean;
};

const ListFooterButton = ({ onClick, disabled, children }: ListFooterButtonProps) => {
  const { styles } = useStyles();

  return (
    <Button type="text" className={styles.addContactButton} onClick={onClick} disabled={disabled}>
      <Text strong>{children}</Text>
      <AddIcon className={styles.addIcon} />
    </Button>
  );
};

export default ListFooterButton;
