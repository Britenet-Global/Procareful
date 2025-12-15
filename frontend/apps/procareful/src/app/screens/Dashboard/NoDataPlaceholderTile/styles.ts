import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  card: css`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px dashed #e4e7eb;
    border-radius: 0.8rem;
    padding: 1.6rem;
    text-align: center;
    gap: 0.8rem;
  `,
  iconContainer: css`
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}));
