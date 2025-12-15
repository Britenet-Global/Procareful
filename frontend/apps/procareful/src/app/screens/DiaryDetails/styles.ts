import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 2.4rem;
    margin-top: auto;
  `,
  spinContainer: css`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}));
