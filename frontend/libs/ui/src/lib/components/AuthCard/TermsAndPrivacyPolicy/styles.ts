import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ token, css }) => ({
  termsAndPrivacyPolicy: css`
    margin-top: 0.8rem !important;
    font-size: ${globalStyles.fontSizes.fontSize};
    color: ${token.colorTextDescription};
    text-align: center;

    & > a {
      color: ${token.colorTextDescription} !important;
      text-decoration: underline !important;
    }
  `,
}));
