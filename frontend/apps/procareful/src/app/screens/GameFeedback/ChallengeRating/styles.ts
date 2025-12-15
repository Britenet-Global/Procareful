import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  title: css`
    margin-bottom: 2.4rem !important;
  `,
  label: css`
    & > label {
      font-weight: 700;
      margin-bottom: 2.4rem !important;
    }
  `,
  submitButton: css`
    margin: auto auto 0;
    width: 100%;
  `,
}));
