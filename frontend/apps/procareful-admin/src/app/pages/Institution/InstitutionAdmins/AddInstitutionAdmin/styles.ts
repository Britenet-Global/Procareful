import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  buttonContainer: css`
    margin-top: auto;
  `,
}));
