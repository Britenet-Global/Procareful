import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  spinContainer: css`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  subtitle: css`
    & p {
      font-weight: 400 !important;
    }
  `,
  noDataSubtitle: css`
    & p {
      font-weight: 700 !important;
    }
  `,
}));
