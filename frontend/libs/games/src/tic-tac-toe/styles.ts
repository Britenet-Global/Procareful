import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
  `,
  gameInfoContainer: css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;

    @media screen and (min-width: 768px) {
      width: clamp(30%, 60rem, 100%);
    }
  `,
  pointsContainer: css`
    display: flex;
    align-items: center;

    > span:last-child {
      font-size: 1.6rem;
      line-height: 1.6rem;
      display: flex;
      align-items: center;
    }
  `,
  logoIcon: css`
    font-size: 2rem;
    margin-right: 0.4rem;
  `,
  rewardContainer: css`
    display: flex;
    align-items: center;
  `,
  rewardIcon: css`
    font-size: 2rem !important;
    color: ${token.colorBorder};

    @media screen and (min-width: 576px) {
      font-size: 2.5rem !important;
    }
  `,
  won: css`
    color: ${token.colorWarning} !important;
  `,
  lost: css`
    color: ${token.colorError} !important;
  `,
  timeContainer: css`
    display: flex;
    align-items: center;
    font-size: 1.6rem;

    > span {
      font-size: 1.6rem;
      line-height: 1.6rem;
    }
  `,
  timeIcon: css`
    font-size: 1.8rem !important;
    margin-right: 0.4rem;
  `,
  figureContainer: css`
    width: 100%;
    display: flex;

    @media screen and (min-width: 768px) {
      width: clamp(30%, 60rem, 100%);
    }
  `,
  figureDescription: css`
    display: flex;
    align-items: center;
    padding: 0.8rem;
    background-color: ${globalStyles.gamesColors.neutral100};
    border-radius: 0.8rem;
    margin-block: 1rem;
  `,
  figureText: css`
    margin-right: 0.6rem !important;
  `,
  chosenFigureIcon: css`
    font-size: 1.8rem !important;
  `,
  crossFigureIconSmall: css`
    font-size: 4rem !important;

    @media screen and (min-width: 576px) {
      font-size: 6.2rem !important;
    }
  `,
  circleFigureIconSmall: css`
    font-size: 3.5rem !important;

    @media screen and (min-width: 576px) {
      font-size: 5.5rem !important;
    }
  `,
  crossFigureIconMedium: css`
    font-size: 4rem !important;

    @media screen and (min-width: 576px) {
      font-size: 6.2rem !important;
    }
  `,
  circleFigureIconMedium: css`
    font-size: 3.5rem !important;

    @media screen and (min-width: 576px) {
      font-size: 5.5rem !important;
    }
  `,
  board: css`
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    box-shadow: ${globalStyles.gamesColors.boardBoxShadow} !important;
    background: ${globalStyles.themeColors.colorBgContainer} !important;
    border: 1px solid ${globalStyles.gamesColors.neutral100};
  `,
  row: css`
    display: flex;
    flex: 1;

    &:first-child > div {
      border-top: none;
    }

    &:last-child > div {
      border-bottom: none;
    }
  `,
  cell: css`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${globalStyles.gamesColors.primaryBorderColor};
    font-size: 4rem;
    color: ${globalStyles.gamesColors.primaryElementsColor};

    &:first-child {
      border-left: none;
    }

    &:last-child {
      border-right: none;
    }
  `,
  button: css`
    margin-top: 2rem;
    width: 100%;
  `,
  successCell: css`
    background-color: ${globalStyles.themeColors.colorSuccessBgHover} !important;
  `,
  failureCell: css`
    background-color: ${globalStyles.themeColors.colorErrorBgHover} !important;
  `,
}));
