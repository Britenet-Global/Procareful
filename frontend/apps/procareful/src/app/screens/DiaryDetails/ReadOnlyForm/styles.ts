import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `,
  feedbackContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 2.4rem;
  `,

  dataContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  noDataValue: css`
    color: ${token.colorTextDescription};
  `,
}));
