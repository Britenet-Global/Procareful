import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    height: 100vh;
    width: 100%;
  `,
  headerContainer: css`
    height: 7.2rem;
    background-color: ${token.colorBgLayout};
    border-bottom: 0.1rem solid ${token.colorBorder};
    padding: 0;
  `,
  content: css`
    height: 100%;
    padding: 1.6rem 2.4rem 1.6rem 1.6rem;
    overflow-y: auto;
    overflow-x: hidden;
  `,
}));
