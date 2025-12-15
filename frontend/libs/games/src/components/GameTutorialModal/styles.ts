import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    max-height: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
  `,
  gif: css`
    height: max-content;
    width: 100%;
  `,
  text: css`
    width: 100%;
    margin-top: 4.8rem !important;
    text-align: center !important;
  `,
  button: css`
    width: 100%;
    margin-top: 3.2rem;
  `,
}));
