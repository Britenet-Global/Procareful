import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    justify-content: flex-end;
    margin-top: 1.6rem;
  `,
  resetButton: css`
    margin-right: 1.6rem;
  `,
}));
