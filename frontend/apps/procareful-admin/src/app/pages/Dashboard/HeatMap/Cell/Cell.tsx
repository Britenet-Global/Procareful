import { forwardRef } from 'react';
import { Tooltip } from 'antd';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type CellProps = {
  color: string;
  date: string;
};

const Cell = forwardRef<HTMLDivElement, CellProps>(({ color, date }, ref) => {
  const { styles } = useStyles({ color });

  return (
    <Tooltip title={<Text className={styles.tooltipText}>{date}</Text>} color="white">
      <div ref={ref} className={styles.cell} />
    </Tooltip>
  );
});

Cell.displayName = 'Cell';

export default Cell;
