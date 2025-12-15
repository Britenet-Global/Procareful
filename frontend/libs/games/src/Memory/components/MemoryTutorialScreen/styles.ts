import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    max-height: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3rem;
  `,
  gif: css`
    height: max-content;
    width: 100%;
  `,
  title: css`
    text-align: center !important;
  `,
  text: css`
    margin-top: 0.8rem !important;
    margin-bottom: auto !important;
    text-align: center !important;
  `,
  button: css`
    width: 100%;
  `,
}));
