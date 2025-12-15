import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  titleContainer: css`
    display: flex;
  `,
  requiredMark: css`
    color: ${token.colorErrorHover};
    margin-right: 0.4rem !important;
  `,
}));
