import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    text-align: center;
  `,
  button: css`
    margin-top: auto;
    width: 100%;
  `,
  rewardText: css`
    margin-top: -1rem !important;
  `,
}));
