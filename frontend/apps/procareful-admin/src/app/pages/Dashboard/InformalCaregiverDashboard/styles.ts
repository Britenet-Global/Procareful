import { createStyles } from 'antd-style';
import { customScreenBreakpointM } from '@ProcarefulAdmin/constants';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(8, 1fr);
    grid-column-gap: 1.6rem;
    grid-row-gap: 1.6rem;
    padding-bottom: 2rem;
    padding-inline: 0.3rem;

    @media (max-width: ${customScreenBreakpointM}) {
      grid-template-rows: repeat(3, 1fr);
    }
  `,
  cognitiveGamesEngagementContainer: css`
    grid-area: 1 / 1 / 5 / 8;

    @media (max-width: ${customScreenBreakpointM}) {
      grid-area: 1 / 1 / 2 / 13;
    }
  `,
  notificationCenterContainer: css`
    grid-area: 5 / 1 / 9 / 13;

    @media (max-width: ${customScreenBreakpointM}) {
      grid-area: 3 / 1 / 4 / 13;
    }
  `,
  seniorPerformanceContainer: css`
    grid-area: 1 / 8 / 5 / 13;

    @media (max-width: ${customScreenBreakpointM}) {
      grid-area: 2 / 1 / 3 / 13;
    }
  `,
}));
