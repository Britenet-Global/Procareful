import type { ThemeConfig } from 'antd';
import { globalStyles } from './globalStyles';

const { themeColors, borderRadius, fontFamily, sizeStep, accentColors } = globalStyles;

export const ProcarefulTheme: ThemeConfig = {
  token: {
    ...themeColors,
    fontFamily,
    borderRadius,
    sizeStep,
  },
  cssVar: true,
  components: {
    Progress: {
      defaultColor: themeColors.colorPrimaryActive,
      remainingColor: accentColors.colorNeutralBorder,
      circleTextColor: themeColors.colorPrimaryActive,
    },
    Table: {
      cellPaddingBlock: 8,
      cellPaddingInline: 8,
      stickyScrollBarBg: accentColors.colorScrollbar,
    },
    Layout: {
      siderBg: `radial-gradient(308.26% 56.66% at -7.73% 20.1%, rgba(0, 68, 64, 0.6) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(0deg, ${themeColors.colorPrimaryActive}, ${themeColors.colorPrimaryActive})`,
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
  },
};
