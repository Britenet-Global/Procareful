import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  description: css`
    overflow: hidden;
    display: box;
    box-orient: vertical;
    line-clamp: 2;
  `,
}));
