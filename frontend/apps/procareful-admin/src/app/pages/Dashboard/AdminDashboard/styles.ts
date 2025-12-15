import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(7, 1fr);
    grid-column-gap: 1.6rem;
    grid-row-gap: 1.6rem;
    padding-bottom: 2rem;
    padding-inline: 0.3rem;

    @media (max-height: ${token.screenMD}px) {
      grid-template-rows: repeat(12, 1fr);
      grid-row-gap: 0;
    }
  `,
  seniorsAmount: css`
    grid-area: 1 / 1 / 2 / 2;

    @media (max-height: ${token.screenMD}px) {
      grid-area: 1 / 1 / 3 / 2;
      & > div {
        padding: 0 1.6rem !important;
      }
    }
  `,
  informalAmount: css`
    grid-area: 2 / 1 / 3 / 2;

    @media (max-height: ${token.screenMD}px) {
      grid-area: 3 / 1 / 5 / 2;
      & > div {
        padding: 0 1.6rem !important;
      }
    }
  `,
  formalAmount: css`
    grid-area: 3 / 1 / 4 / 2;

    @media (max-height: ${token.screenMD}px) {
      grid-area: 5 / 1 / 7 / 2;
      & > div {
        padding: 0 1.6rem !important;
      }
    }
  `,
  rolesDistribution: css`
    grid-area: 4 / 1 / 8 / 2;

    @media (max-height: ${token.screenMD}px) {
      grid-area: 7 / 1 / 13 / 2;
    }
  `,
  caregiversWorkload: css`
    grid-area: 1 / 2 / 8 / 3;

    @media (max-height: ${token.screenMD}px) {
      grid-area: 1 / 2 / 13 / 3;
    }
  `,
}));
