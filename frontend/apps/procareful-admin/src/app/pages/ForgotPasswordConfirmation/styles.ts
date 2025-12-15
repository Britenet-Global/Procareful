import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes } = globalStyles;

export const useStyles = createStyles(({ css, token }) => ({
  cardContainer: css`
    height: auto !important;
  `,
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
  `,
  confirmationTextContainer: css`
    background-color: ${token.colorPrimaryBg};
    padding: 0.8rem 1.6rem;
    margin-bottom: 3.2rem;
  `,
  confirmationText: css`
    color: ${token.colorPrimaryTextActive};
    font-size: ${fontSizes.fontSizeLG};
  `,
}));
