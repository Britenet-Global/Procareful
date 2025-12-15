import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
    height: 100%;
    padding-right: 2rem;
  `,
}));
