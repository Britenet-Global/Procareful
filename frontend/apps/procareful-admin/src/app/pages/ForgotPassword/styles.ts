import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  forgotPasswordText: css`
    margin-bottom: 3.2rem !important;
  `,
  submitButton: css`
    height: fit-content;

    & > span {
      width: 100%;
      display: block;
      overflow-wrap: break-word;
      white-space: wrap;
      height: fit-content;
    }
  `,
}));
