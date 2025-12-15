import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  cardsContainer: css`
    margin-top: 1.6rem;
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
    flex-grow: 1;
  `,
}));
