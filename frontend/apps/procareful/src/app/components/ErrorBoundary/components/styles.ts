import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    margin: 10rem auto 0;
    padding: 2rem 1rem;
    max-width: 60rem;
  `,
  card: css`
    .ant-card-body {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      gap: 2rem;
      text-align: center;
    }
  `,
  button: css`
    width: 100%;
  `,
  icon: css`
    font-size: 8rem;
  `,
}));
