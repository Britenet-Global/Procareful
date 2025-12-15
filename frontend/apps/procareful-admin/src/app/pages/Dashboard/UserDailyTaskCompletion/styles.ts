import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSize } = globalStyles.fontSizes;

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
  `,
  cardContainer: css`
    height: 100% !important;
  `,
  progress: css`
    .ant-progress-text {
      font-weight: 700;
      font-size: 1.7rem !important;
    }
    .ant-progress-inner {
      width: 7rem !important;
      height: 7rem !important;
    }
  `,
  textContainer: css`
    margin-left: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  currentDate: css`
    font-size: ${fontSize};
    margin-top: 0.3rem;
    color: ${token.colorText};
  `,
}));
