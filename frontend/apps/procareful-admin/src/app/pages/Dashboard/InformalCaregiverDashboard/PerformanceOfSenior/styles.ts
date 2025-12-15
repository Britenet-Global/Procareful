import { createStyles } from 'antd-style';
import { customScreenBreakpoint } from '@ProcarefulAdmin/constants';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  card: css`
    justify-content: flex-start !important;

    .ant-card-body {
      flex: 1;
      flex-grow: 1 !important;
      overflow: hidden;
      justify-content: space-between;

      & > div:first-child {
        overflow-y: auto !important;
        height: 100% !important;
      }
    }
  `,
  progressContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
    height: 100%;
    width: 100%;
    margin: 0 1rem;
  `,
  select: css`
    width: 16rem;
  `,
  lineProgressContainer: css``,
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
  chartDescription: css`
    height: fit-content !important;
  `,
}));
