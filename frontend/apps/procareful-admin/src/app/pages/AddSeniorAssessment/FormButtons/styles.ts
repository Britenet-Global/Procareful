import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  `,
  twoButtonContainer: css`
    justify-content: flex-end;
  `,
  button: css`
    width: min-content !important;
    padding-inline: 2rem !important;
  `,
}));
