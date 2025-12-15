import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  submitButton: css`
    margin: auto auto 0;
    width: 100%;
  `,
}));
