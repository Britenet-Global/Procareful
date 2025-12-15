import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  cardContainer: css`
    height: 49rem;
  `,
  subtitleContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  changeEmailLink: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
    margin-left: 0.4rem;
  `,
  paragraph: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
  `,
  greyOutText: css`
    color: ${token.colorTextDescription};

    & > strong {
      font-weight: 700;
    }
  `,
  resendCodeButtonContainer: css`
    width: min-content;
    margin-top: 0;
  `,
  resendCodeButtonContainerDisabled: css`
    cursor: not-allowed !important;
  `,
  resendCodeButtonContent: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG};
    display: flex;
    column-gap: 1rem !important;
  `,
  resendCodeButtonContentDisabled: css`
    color: ${token.colorTextDescription} !important;
  `,
}));
