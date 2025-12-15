import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  cardContainer: css`
    .ant-card-head-title {
      max-width: 81rem;
      margin-bottom: 2.4rem;
    }
  `,
  nameContainer: css`
    margin-bottom: 1.2rem;
  `,
  container: css`
    display: flex;
    justify-content: flex-end;
    margin-top: 1.6rem;
  `,
  resetButton: css`
    margin-right: 1.6rem;
  `,
}));
