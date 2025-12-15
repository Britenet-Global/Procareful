import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: grid;
    justify-items: center;
    align-items: center;
    padding: 2rem 0;
  `,
  1: css`
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1.6rem;
  `,
  2: css`
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1.6rem;
  `,
  3: css`
    gap: 2.4rem 1.7rem;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
  `,
  4: css`
    gap: 2.4rem 1.5rem;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
  `,
  5: css`
    gap: 2.4rem 1.5rem;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
  `,
  6: css`
    gap: 2.4rem 1.5rem;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
  `,
  spinContainer: css`
    position: absolute;
    top: 35vh;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10rem;
  `,
  diffButton: css`
    width: 100%;
    grid-column: 1/-1;
  `,
}));
