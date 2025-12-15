import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.6rem;
    row-gap: 0.2rem;

    & span {
      display: block;
    }
  `,

  headerText: css`
    font-size: ${globalStyles.fontSizes.fontSize};
    color: ${token.colorText};
  `,
  supportingContactRelation: css`
    font-size: ${globalStyles.fontSizes.fontSize} !important;
    color: ${token.colorTextDescription};
    margin-bottom: 0.6rem !important;
  `,
}));
