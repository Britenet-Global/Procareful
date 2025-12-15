import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css, responsive }) => ({
  container: css`
    height: 52rem;
    max-width: 40.8rem;
    padding: 3.2rem 1.6rem;
    width: 100%;
    background: ${token.colorBgContainer};
    border-radius: 0.4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-inline: 5.2%;

    ${responsive.mobile} {
      height: 47.8rem;
      max-width: 34rem;
      padding: 2.4rem 1.6rem;

      p,
      span {
        text-align: center;
      }
    }
  `,
}));
