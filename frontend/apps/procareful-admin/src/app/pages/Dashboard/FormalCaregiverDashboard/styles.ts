import { createStyles } from 'antd-style';
import { customScreenBreakpointL } from '@ProcarefulAdmin/constants';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(8, 1fr);
    grid-column-gap: 1.6rem;
    grid-row-gap: 1.6rem;
    padding-bottom: 2rem;
    padding-inline: 0.3rem;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-template-rows: repeat(3, 1fr);
    }
  `,
  cognitiveGamesEngagementContainer: css`
    grid-area: 1 / 1 / 5 / 5;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-area: 1 / 1 / 2 / 7;
    }
  `,
  notificationCenterContainer: css`
    grid-area: 5 / 1 / 9 / 7;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-area: 3 / 1 / 4 / 7;
    }
  `,
  mostActiveSeniorsContainer: css`
    grid-area: 1 / 5 / 5 / 7;
    max-height: 40rem;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-area: 2 / 1 / 3 / 7;
    }
  `,
}));
