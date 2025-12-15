import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  paragraphContainer: css`
    margin: 0 !important;
  `,
  title: css`
    font-weight: 700 !important;
  `,
  paragraph: css`
    margin: 0 !important;
    white-space: pre-wrap;
    font-weight: 400 !important;
  `,
  text: css`
    margin: 0 !important;
    font-weight: 400 !important;
  `,
}));
