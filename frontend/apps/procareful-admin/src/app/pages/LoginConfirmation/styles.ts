import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: fit-content;
  `,
  resendCodeButton: css`
    width: 100%;
    height: fit-content;

    & > span {
      width: 100%;
      white-space: normal;
      height: fit-content;
    }
  `,
}));
