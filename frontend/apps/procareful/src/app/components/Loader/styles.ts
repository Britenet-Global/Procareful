import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      155.54% 155.54% at 50% -16.68%,
      #28c2a0 6.66%,
      #048271 58.71%,
      #004440 100%
    );
  `,
  logoIcon: css`
    font-size: 3.2rem;
  `,
  logoText: css`
    color: ${token.colorBgLayout} !important;
    display: inline-block;
    margin-left: 0.8rem;
  `,
  spinner: css`
    margin-top: 1.6rem;

    & .ant-spin-dot-holder {
      color: ${token.colorPrimaryBg} !important;
    }
  `,
}));
