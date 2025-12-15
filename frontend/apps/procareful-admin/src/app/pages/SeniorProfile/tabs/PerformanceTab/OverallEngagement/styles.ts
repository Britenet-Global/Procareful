import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  card: css`
    border-color: ${token.colorBorder} !important;
    justify-content: flex-start !important;
    .ant-card-head-title h5 {
      font-size: ${globalStyles.fontSizes.fontSize} !important;
    }
    .ant-card-body {
      flex: 1;
      overflow: hidden;
      justify-conten: space-between !important;

      & > div:first-child {
        overflow-y: auto !important;
        height: 100% !important;
      }
    }
  `,
  progressContainer: css`
    display: flex;
    justify-content: space-around;
    align-items: start;
    gap: 3rem;
    height: 100%;
    width: 100%;
    margin: 0 1rem;
  `,
}));
