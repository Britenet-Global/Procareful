import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  textButton: css`
    margin-top: 0.8rem;
    margin-bottom: 3.2rem;
    text-align: left;
    padding: 0 !important;
    width: min-content;

    &:hover {
      background: none !important;
    }

    span {
      color: ${token.colorPrimary};
      text-decoration: underline;
    }
  `,
}));
