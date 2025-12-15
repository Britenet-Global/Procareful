import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { gamesColors, gameStyles, fontSizes, themeColors } = globalStyles;

const {
  teal100,
  teal200,
  teal300,
  teal500,
  teal600,
  green400,
  green500,
  blue400,
  blue500,
  purple200,
  purple300,
  neutral100,
  neutral200,
} = gamesColors;
const { borderRadius } = gameStyles;
const { fontSizeHeading5, fontSizeHeading2 } = fontSizes;
const { colorText } = themeColors;

const pixelSize = '0.8rem';
const breakpoint = '51.2rem';

export const useStyles = (tileCount = 0) =>
  createStyles(({ css }) => ({
    container: css`
      padding: 0 calc(${pixelSize} * 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    `,
    layoutContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
    `,
    summaryContainer: css`
      width: calc(${pixelSize} * 8 * 4 + ${pixelSize} * 5);
      margin-bottom: 1.6rem;

      @media (min-width: ${breakpoint}) {
        width: calc(${pixelSize} * 12.5 * 4 + ${pixelSize} * 10);
      }
    `,
    swiperContainer: css`
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
    `,
    score: css`
      display: flex;
      align-items: center;
      margin: calc(${pixelSize} * 1) 0;

      & > * {
        flex: 1;
      }
    `,
    board: css`
      margin-top: 2.8rem;
      position: relative;
      width: min(95vw, 60rem);
      height: min(95vw, 60rem);
    `,
    grid: css`
      display: grid;
      margin: 0 auto;
      padding: 1rem;
      height: 100%;
      width: 100%;
      background: ${neutral100};
      gap: 0.8rem;
      grid-template-columns: repeat(${tileCount}, 1fr);
      grid-template-rows: repeat(${tileCount}, 1fr);
    `,
    cell: css`
      border-radius: ${borderRadius};
      background: ${neutral200};
    `,
    tiles: css`
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
    `,
    tile: css`
      position: absolute;
      border-radius: ${borderRadius};
      background: ${neutral200};
      color: ${colorText};
      font-weight: bold;
      text-align: center;
      transition-property: left, top, transform;
      transition-duration: 200ms, 200ms, 100ms;
      user-select: none;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: clamp(${fontSizeHeading5}, 5vw, ${fontSizeHeading2});
    `,
    tile2: css`
      background-color: ${teal100};
    `,
    tile4: css`
      background-color: ${teal200};
    `,
    tile8: css`
      background-color: ${teal300};
    `,
    tile16: css`
      background-color: ${teal500};
    `,
    tile32: css`
      background-color: ${teal600};
    `,
    tile64: css`
      background-color: ${green400};
    `,
    tile128: css`
      background-color: ${green500};
    `,
    tile256: css`
      background-color: ${blue400};
    `,
    tile512: css`
      background-color: ${blue500};
    `,
    tile1024: css`
      background-color: ${purple200};
    `,
    tile2048: css`
      background-color: ${purple300};
    `,
    spinContainer: css`
      display: flex;
      justify-content: center;
      margin-top: 15rem;
    `,
    diffButton: css`
      width: 100%;
    `,
  }))();
