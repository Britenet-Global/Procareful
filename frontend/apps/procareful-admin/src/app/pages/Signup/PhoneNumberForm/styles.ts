import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  emailContainer: css`
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-top: 0.4rem;
  `,
  changeEmailLink: css`
    font-weight: 400 !important;
    margin-left: 0.4rem;
    height: 2.2rem;
  `,
}));
