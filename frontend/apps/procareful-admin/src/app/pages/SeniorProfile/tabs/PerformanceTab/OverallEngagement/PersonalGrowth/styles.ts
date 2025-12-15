import { createStyles } from 'antd-style';
import { customScreenBreakpointL, customScreenBreakpointXL } from '@ProcarefulAdmin/constants';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  `,
  header: css`
    padding-top: 0.5rem;
    font-size: ${globalStyles.fontSizes.fontSize} !important;
    text-align: center;
  `,
  description: css`
    color: ${globalStyles.themeColors.colorTextDescription};
    text-align: center;
  `,
  progress: css`
    width: 100% !important;
    height: 100% !important;

    .ant-progress-text {
      font-size: 2.4rem !important;

      @media (min-width: ${customScreenBreakpointL}) {
        font-size: 3rem !important;
      }
      @media (min-width: ${customScreenBreakpointXL}) {
        font-size: 3.4rem !important;
      }
    }
    .ant-progress-inner {
      width: 100% !important;
      height: 100% !important;
    }
  `,
}));
