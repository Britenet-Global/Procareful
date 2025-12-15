import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  graph: css`
    display: flex;
    flex-grow: 1;
    padding-right: 1.6rem;
  `,
  placeholder: css`
    margin-bottom: 5rem;
    padding-bottom: 2rem;
  `,
}));
