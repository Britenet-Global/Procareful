import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 2.4rem;
  `,
  header: css`
    width: 100%;
    margin-bottom: 0.8rem;
  `,
  moreGamesHeader: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 0.8rem;
  `,
  todayGameText: css`
    line-height: 2.2rem;
  `,
  otherGamesContainer: css`
    margin: 1.6rem 0 0;
  `,
}));
