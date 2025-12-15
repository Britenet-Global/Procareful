import { createStyles } from 'antd-style';

const cellHeight = '2rem';
const cellMargin = '0.2rem';

export const useStyles = createStyles(({ css }) => ({
  line: css`
    display: flex;
    max-height: 2.4rem;
    align-items: center;
  `,
  activityLine: css`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: 1rem;
    height: ${cellHeight};
    border: 1px solid transparent;
    margin: ${cellMargin};
    width: 100%;
  `,
}));
