import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  welcomeDescription: css`
    margin-top: 0.8rem !important;
  `,
  progressContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2.4rem;
  `,
  progress: css`
    max-width: 20rem;

    &.ant-progress {
      margin: 0 !important;
    }
  `,
}));
