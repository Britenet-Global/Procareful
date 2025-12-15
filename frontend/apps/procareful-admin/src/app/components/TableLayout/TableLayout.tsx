import { Table as AntTable, Pagination, type PaginationProps, type TableProps } from 'antd';
import type { PaginationTableProps, TableSkeletonColumnsType } from '@ProcarefulAdmin/typings';
import StyledCard from '../StyledCard';
import TableSkeleton from './TableSkeleton';
import { useStyles } from './styles';

type TableLayoutProps = TableProps & {
  tableHeader?: JSX.Element;
  containerBordered?: boolean;
  containerClassName?: string;
  isLoading?: boolean;
  children?: JSX.Element;
  isMultilineCell?: boolean;
  pagination: PaginationTableProps;
};

const TableLayout = ({
  tableHeader,
  className,
  containerBordered = false,
  containerClassName,
  dataSource,
  columns,
  isLoading,
  children,
  isMultilineCell = false,
  pagination,
  ...tableProps
}: TableLayoutProps) => {
  const { styles, cx } = useStyles();

  const { paginationPosition = 'below', ...paginationData } = pagination || {};

  const paginationConfig: PaginationProps = {
    ...paginationData,
    showSizeChanger: false,
    size: 'small',
    className: styles.pagination,
  };

  const showPagination = pagination && dataSource ? dataSource.length > 0 : false;

  return (
    <StyledCard
      title={tableHeader}
      bordered={containerBordered}
      className={containerClassName}
      fullHeight
    >
      <TableSkeleton
        active
        loading={isLoading}
        columns={columns as TableSkeletonColumnsType[]}
        className={styles.skeleton}
      >
        <AntTable
          className={cx(styles.tableContainer, className, {
            [styles.cellPadding]: !isMultilineCell,
          })}
          columns={columns}
          dataSource={dataSource}
          pagination={showPagination && paginationPosition === 'below' ? paginationConfig : false}
          {...tableProps}
        />
      </TableSkeleton>
      {children}
      {showPagination && paginationPosition === 'bottom' && (
        <Pagination
          {...paginationConfig}
          className={cx(styles.pagination, styles.bottomPagination)}
        />
      )}
    </StyledCard>
  );
};

export default TableLayout;
