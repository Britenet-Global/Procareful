import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css, responsive }) => ({
  headerContainer: css`
    margin-bottom: 3.2rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    row-gap: 3.2rem;

    ${responsive.mobile} {
      row-gap: 1.6rem;
      margin-bottom: 0.8rem;
    }
  `,
  logoContainer: css`
    display: flex;
  `,
  procareful: css`
    display: none;

    ${responsive.tablet} {
      display: inline-block;
      color: ${accentColors.colorNeutralText} !important;
    }
  `,
  icon: css`
    font-size: 3.2rem;

    ${responsive.mobile} {
      font-size: ${fontSizes.fontSizeXL} !important;
      margin-right: 0.8rem;
    }
  `,
  title: css`
    text-align: center;

    ${responsive.mobile} {
      font-size: ${fontSizes.fontSizeXL} !important;
    }
  `,
}));
