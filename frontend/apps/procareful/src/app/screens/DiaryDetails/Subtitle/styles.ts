import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.4rem;
  `,
  date: css`
    color: ${token.colorTextDescription};
  `,
}));
