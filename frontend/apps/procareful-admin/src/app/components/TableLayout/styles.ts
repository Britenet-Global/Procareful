import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  tableContainer: css`
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 0.4rem;
    overflow: hidden;

    .ant-table-cell::before {
      width: 0 !important;
    }
  `,
  cellPadding: css`
    tbody .ant-table-cell {
      padding: 1.6rem !important;
    }
  `,
  skeleton: css`
    .ant-skeleton-title {
      height: 40rem !important;
    }
  `,
  pagination: css`
    text-align: right;

    .ant-pagination-item {
      border-radius: 0.6rem !important;
    }
  `,
  bottomPagination: css`
    margin-top: 1.6rem;
  `,
}));
