import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const customScreenWidth = '2000px';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    margin-left: 11.5rem;
  `,
  text: css`
    font-size: ${globalStyles.fontSizes.fontSizeSM};
    color: ${globalStyles.editIcon.color};
  `,
  timeline: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-bottom: 0.3rem;
    max-height: 15rem;

    @media (min-width: ${customScreenWidth}) {
      max-height: 30rem;
    }

    &::-webkit-scrollbar {
      width: 0.8rem !important;
    }
  `,
  scrollable: css`
    overflow-y: scroll;
  `,
  seniorName: css`
    min-width: 11.5rem !important;
    width: 11.5rem !important;
    flex-grow: 1;
    font-size: ${globalStyles.fontSizes.fontSizeSM};
    overflow: hidden;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
  `,
  tooltipText: css`
    color: ${globalStyles.themeColors.colorText};
    font-size: ${globalStyles.fontSizes.fontSizeSM};
  `,
  initialSpin: css`
    margin-top: 8rem;
  `,
  heatMap: css`
    .ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
      position: fixed !important;
      top: 33% !important;
      inset-inline-start: inherit !important;
      margin: auto !important;

      @media (min-width: ${customScreenWidth}) {
        top: 30% !important;
      }
    }
  `,
}));
