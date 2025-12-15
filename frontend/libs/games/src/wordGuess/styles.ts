import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: min(80vh, 60rem);
  `,
  displayContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding-bottom: 1rem;
  `,
  diffContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: min(40vh, 60rem);
    padding-bottom: 1rem;
  `,
  keyboardContainer: css`
    display: flex;
    justify-content: center;
    padding: 0 1rem;
  `,
  spinContainer: css`
    display: flex;
    justify-content: center;
    margin-top: 15rem;
  `,
}));
