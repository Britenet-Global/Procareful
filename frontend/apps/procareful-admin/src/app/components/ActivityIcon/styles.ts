import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors, themeColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  iconBackground: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 0.4rem;
  `,

  physicalIconBackground: css`
    background-color: ${accentColors.colorPurpleBg};
  `,
  breathingIconBackground: css`
    background-color: ${themeColors.colorInfoBg};
  `,
  cognitiveIconBackground: css`
    background-color: ${themeColors.colorPrimaryBg};
  `,
  personalGrowthBackground: css`
    background-color: ${accentColors.colorOrangeBg};
  `,
  icon: css`
    font-size: ${fontSizes.fontSizeHeading3} !important;
  `,
  physicalIcon: css`
    color: ${accentColors.colorPurple};
  `,
  breathingIcon: css`
    color: ${themeColors.colorInfo};
  `,
  cognitiveIcon: css`
    color: ${themeColors.colorPrimaryHover};
  `,
  personalGrowthIcon: css`
    color: ${accentColors.colorOrangeHover};
  `,
}));
