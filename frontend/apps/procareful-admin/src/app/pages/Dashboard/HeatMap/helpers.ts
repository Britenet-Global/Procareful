import { type GameScoreDto } from '@Procareful/common/api';
import { globalStyles } from '@Procareful/ui';

export const colorFunction = (activityLevel: GameScoreDto['totalTime']) => {
  const activityTimeConvertedToMinutes = activityLevel / 60;

  const { colorNeutralBgHover } = globalStyles.accentColors;
  const { colorSuccessBg, colorSuccessBgHover, colorSuccessBorderHover, colorSuccess } =
    globalStyles.themeColors;

  if (activityTimeConvertedToMinutes === 0) {
    return colorNeutralBgHover;
  }
  if (activityTimeConvertedToMinutes < 5) {
    return colorSuccessBg;
  }
  if (activityTimeConvertedToMinutes < 10) {
    return colorSuccessBgHover;
  }
  if (activityTimeConvertedToMinutes < 15) {
    return colorSuccessBorderHover;
  }

  return colorSuccess;
};
