import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  overflowContainer: css`
    overflow-y: auto;
    height: 100%;
  `,
  container: css`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(8, 11.5rem);
    grid-column-gap: 1.6rem;
    grid-row-gap: 1.6rem;
    padding-bottom: 2rem;
  `,
  progressContainer: css`
    grid-area: 1 / 1 / 2 / 2;
  `,
  barChartContainer: css`
    grid-area: 1 / 2 / 5 / 3;
  `,
  lineChartContainer: css`
    grid-area: 2 / 1 / 5 / 2;
  `,
  tableContainer: css`
    grid-area: 5 / 1 / 9 / 3;
  `,
}));
