import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  table: css`
    .ant-table-cell {
      border-bottom: none !important;
    }
  `,
}));
