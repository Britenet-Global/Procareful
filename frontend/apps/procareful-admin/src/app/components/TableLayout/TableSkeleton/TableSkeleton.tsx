import { Skeleton, type SkeletonProps, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { TableSkeletonColumnsType } from '@ProcarefulAdmin/typings';
import { useStyles } from './styles';

type TableSkeletonProps = SkeletonProps & {
  columns: ColumnsType<TableSkeletonColumnsType>;
  rowCount?: number;
};

const TableSkeleton = ({
  loading = false,
  active = false,
  rowCount = 1,
  columns,
  children,
  className,
}: TableSkeletonProps): JSX.Element => {
  const { styles } = useStyles();

  return loading ? (
    <Table
      rowKey="key"
      pagination={false}
      className={styles.table}
      dataSource={[...Array(rowCount)].map((_, index) => ({
        key: `key${index}`,
      }))}
      columns={columns.map(column => ({
        ...column,
        render: () => (
          <Skeleton
            key={column.key}
            title
            active={active}
            paragraph={false}
            className={className}
          />
        ),
      }))}
    />
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  );
};

export default TableSkeleton;
