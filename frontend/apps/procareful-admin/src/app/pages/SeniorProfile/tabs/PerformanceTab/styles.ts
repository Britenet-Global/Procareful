import { createStyles } from 'antd-style';
import { customScreenBreakpointL } from '@ProcarefulAdmin/constants';

export const useStyles = createStyles(({ css }) => ({
  wrapperContainer: css`
    overflow: auto;
  `,
  container: css`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(8, 1fr);
    grid-column-gap: 1.6rem;
    grid-row-gap: 1.6rem;
    padding-bottom: 2rem;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-template-columns: repeat(1, 1fr);
      grid-template-rows: repeat(3, 1fr);
    }
  `,
  overallEngagementContainer: css`
    grid-area: 1 / 1 / 5 / 4;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-area: 1 / 1 / 2 / 2;
    }
  `,
  physicalActivityContainer: css`
    grid-area: 1 / 4 / 5 / 7;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-area: 2 / 1 / 3 / 2;
    }
  `,
  cognitiveGamesContainer: css`
    grid-area: 5 / 1 / 9 / 7;

    @media (max-width: ${customScreenBreakpointL}) {
      grid-area: 3 / 1 / 4 / 2;
    }
  `,
}));
