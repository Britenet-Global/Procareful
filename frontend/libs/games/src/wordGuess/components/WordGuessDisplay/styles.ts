import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    gap: 0.75rem;
    text-transform: uppercase;
    text-align: center;
    top: 3rem;
  `,
  letter: css`
    width: 3.5rem;
    font-size: ${fontSizes.fontSizeHeading2} !important;
    font-weight: bold;
    border-bottom-width: 0.2rem;
    border-bottom-color: ${globalStyles.themeColors.colorText} !important;
    border-bottom-style: solid;

    & span {
      font-size: ${fontSizes.fontSizeHeading2} !important;
      font-weight: bold;
    }
  `,
}));
