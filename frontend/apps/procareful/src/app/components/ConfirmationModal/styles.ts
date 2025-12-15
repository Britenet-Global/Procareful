import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    .ant-modal {
      width: 90% !important;
      max-width: 38rem;
      text-align: center !important;
      margin-block: auto !important;
      text-align: center;

      & .ant-modal-content {
        padding-inline: 4rem !important;
      }
    }
  `,
  contentContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 3.2rem;

    & p {
      font-size: ${globalStyles.fontSizes.fontSizeLG};
    }
  `,
  footerContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: clamp(1.2rem, 2.4rem, 2.4rem);
    margin-top: 3.2rem;
  `,
}));
