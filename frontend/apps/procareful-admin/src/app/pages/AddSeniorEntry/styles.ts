import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSize } = globalStyles.fontSizes;

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  cardContainer: css`
    .ant-card-head {
      min-height: auto;
    }
  `,
  cardContainerWithBiggerMargin: css`
    margin-bottom: 3.4rem !important;
  `,
  subtitle: css`
    margin-block: 0.8rem;
  `,
  beforeStart: css`
    font-size: ${fontSize} !important;
  `,
  tileInfoContainer: css`
    text-align: left !important;
    max-width: 84rem;

    h5,
    p {
      font-size: ${fontSize} !important;
    }
  `,
  getMocaButton: css`
    padding: 0 !important;
    text-decoration: underline !important;
    color: ${token.colorPrimary} !important;
  `,
  importantNoticeSubtitle: css`
    margin: 0.8rem 0 2.4rem !important;
  `,
  startAssessmentButton: css`
    width: max-content;
    margin: auto 0 0 auto;
  `,
  listContainer: css`
    & > li {
      margin-left: 2.2rem;

      &::marker {
        color: ${token.colorTextHeading};
        font-size: 1rem;
      }
    }
  `,
}));
