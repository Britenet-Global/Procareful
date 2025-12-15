import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100vw;
    height: 100vh;
    background: radial-gradient(
      155.54% 155.54% at 50% -16.68%,
      #28c2a0 6.66%,
      #048271 58.71%,
      #004440 100%
    );
  `,
  content: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}));
