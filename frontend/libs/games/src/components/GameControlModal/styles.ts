import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  contentContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  description: css`
    margin-top: 1.6rem !important;
  `,
  button: css`
    width: 100%;
    margin-top: 3.2rem;
  `,
  secondButton: css`
    width: 100%;
    margin-top: 1.6rem;
  `,
}));
