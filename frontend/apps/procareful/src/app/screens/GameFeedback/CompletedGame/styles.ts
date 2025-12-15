import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  `,
  headingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > span {
      font-size: ${globalStyles.fontSizes.fontSizeHeading5};
      margin-top: 1.2rem !important;
    }
  `,
  descriptionContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;

    & > span {
      text-align: center;
      width: clamp(25rem, 40rem, 100%);
    }
  `,
  footerContainer: css`
    height: 100% !important;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  `,
  completedFooterContainer: css`
    justify-content: space-between;
  `,
  summaryContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: clamp(0rem, 1rem, 1.2rem) !important;

    & > span {
      font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
    }
  `,
  summary: css`
    display: flex;
    margin-top: 0.8rem;

    & > span {
      display: flex;
      align-items: center;

      & > svg:first-child {
        font-size: ${globalStyles.fontSizes.fontSizeHeading4} !important;
      }

      & > svg:last-child {
        font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
      }

      & > span {
        margin-left: 0.4rem !important;
        font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
      }
    }

    & > span:last-child > svg {
      font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    }

    & > span:first-child {
      margin-right: 2.4rem;
    }
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: column;
  `,
}));
