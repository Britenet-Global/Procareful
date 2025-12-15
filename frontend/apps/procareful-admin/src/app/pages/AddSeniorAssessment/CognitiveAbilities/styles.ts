import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  cardContainer: css`
    .ant-card-head-title {
      max-width: 81rem;
    }
  `,
  getMocaButton: css`
    padding: 0 !important;
    margin: 0.8rem 0 2.4rem;
    text-decoration: underline !important;
    color: ${token.colorPrimary} !important;
  `,
  scoreInput: css`
    width: 15.6rem !important;
  `,
}));
