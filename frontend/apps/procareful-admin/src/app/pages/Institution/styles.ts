import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
  `,
  tileContainer: css`
    padding: 2rem 1.6rem;
    max-height: 7.2rem;
  `,
}));
