import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';
import { ICON_SIZE_MAP } from './constants';

const DEFAULT_FONT_SIZE = 14;
type SupportedFontSizes = 14 | 16 | 18 | 20;

const enlargeFontSize = (size: number, val: number) => `${(size + val) / 10}rem`;

export const useStyles = createStyles(({ css, token }) => {
  const { fontSize } = token || {};
  const iconSize =
    ICON_SIZE_MAP[fontSize as SupportedFontSizes] ?? ICON_SIZE_MAP[DEFAULT_FONT_SIZE];

  return {
    container: css`
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      row-gap: 1.6rem;
    `,
    elementContainer: css`
      display: flex;
      gap: 0.6rem;
      align-items: center;
      min-width: 5rem;
      justify-content: center;
    `,
    heartContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.6rem;
    `,
    text: css`
      font-size: ${enlargeFontSize(fontSize, 4)};
    `,
    icon: css`
      width: ${iconSize} !important;
      height: ${iconSize} !important;
    `,
    logoIcon: css`
      font-size: ${enlargeFontSize(fontSize, 8)};
    `,
    timeIcon: css`
      color: ${globalStyles.gamesColors.neutral400};
    `,
    bulbIcon: css`
      color: ${globalStyles.themeColors.colorWarning};
    `,
    heartIcon: css`
      color: ${globalStyles.themeColors.colorErrorBorderHover};
    `,
    stepsContainer: css`
      width: 100%;
      padding: 0 4.2rem;
    `,
  };
});
