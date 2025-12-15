import { createStyles } from 'antd-style';
import { customScreenBreakpoint } from '@ProcarefulAdmin/constants';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  card: css`
    border-color: ${token.colorBorder} !important;
    justify-content: flex-start !important;
    .ant-card-head-title h5 {
      font-size: ${globalStyles.fontSizes.fontSize} !important;
    }
    .ant-card-body {
      flex-grow: 1 !important;
      overflow: hidden;

      & > div {
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
  text: css`
    color: ${globalStyles.themeColors.colorTextHeading};
  `,
  progress: css`
    .ant-progress-text {
      font-size: 4rem !important;

      @media (max-width: ${customScreenBreakpoint}) {
        font-size: 2.8rem !important;
      }
    }
    .ant-progress-inner {
      width: 15rem !important;
      height: 15rem !important;

      @media (max-width: ${customScreenBreakpoint}) {
        width: 10rem !important;
        height: 10rem !important;
      }
    }
  `,
  chartProgressData: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  spinContainer: css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}));
