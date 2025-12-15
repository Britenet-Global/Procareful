import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  cognitiveGamesDescriptionContainer: css`
    display: flex;
    flex-direction: column;
  `,
  marginTop: css`
    margin-top: 0.4rem;
  `,
  title: css`
    width: 50%;
  `,
  cardContainer: css`
    margin-bottom: 1.6rem;

    & .ant-card-body {
      width: clamp(10rem, 100%, 81.6rem);
    }
  `,
  marginResetContainer: css`
    margin-bottom: 0 !important;
  `,
  marginTopContainer: css`
    margin-top: 2.4rem !important;
    margin-bottom: 0 !important;
  `,
}));
