import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';
import { PROGRESS_SIZE_MAP } from '../constants';

const DEFAULT_FONT_SIZE = 14;
type SupportedFontSizes = 14 | 16 | 18 | 20;

export const useStyles = createStyles(({ css, token }) => {
  const { bullet: bulletSize, activeDot: activeDotSize } =
    PROGRESS_SIZE_MAP[token.fontSize as SupportedFontSizes] ?? PROGRESS_SIZE_MAP[DEFAULT_FONT_SIZE];

  return {
    progressBar: css`
      display: flex;
      align-items: center;
      margin-block: 1rem;
      margin-bottom: 3.8rem;
    `,
    bullet: css`
      width: ${bulletSize};
      height: ${bulletSize};
      border-radius: 50%;
      border: 1px solid ${globalStyles.gamesColors.neutral400};
      background-color: transparent;
      position: relative;
    `,
    activeDot: css`
      width: ${activeDotSize};
      height: ${activeDotSize};
      background-color: transparent;
      border: 1px solid ${globalStyles.gamesColors.neutral400};
      margin-inline: 0.1rem;
    `,
    line: css`
      flex: 1;
      height: 0.1rem;
      width: 5rem;
      background: ${globalStyles.accentColors.colorNeutralBorderHover};
    `,
    won: css`
      background-color: ${globalStyles.themeColors.colorInfo};
      border: none;
    `,
    lost: css`
      background-color: ${globalStyles.accentColors.colorOrangeBorderHover};
      border: none;
    `,
    draw: css`
      background-color: ${globalStyles.gamesColors.neutral400};
      border: none;
    `,
    activeDotNumber: css`
      position: absolute;
      top: 1.3rem;
      left: 0.1rem;
      margin-top: 0.6rem;
      font-weight: 400;
    `,
    inactiveDotNumber: css`
      position: absolute;
      top: 1rem;
      left: -0.2rem;
      margin-top: 0.6rem;
      font-weight: 400;
    `,
  };
});
