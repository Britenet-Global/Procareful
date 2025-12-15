import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  card: css`
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    border: 1px solid #bcccdc;
    box-shadow: ${globalStyles.gameCardShadow};
    transition: transform 0.5s ease;
    & .ant-card-body {
      width: 100%;
      height: 100%;
      padding: 0 !important;
      display: grid;
    }
  `,
  iconContainer: css`
    width: 100%;
    height: 100%;
    display: grid;
  `,
  secondIcon: css`
    gap: auto;
  `,
  logoIcon: css`
    place-self: center center;
    & {
      width: 3.7rem !important;
      height: 3.7rem !important;
    }
  `,
  iconToGuess: css`
    place-self: center center;
  `,
  defaultFirstGuessIcon: css`
    & {
      color: ${token.colorErrorHover};
    }
  `,
  hardFirstGuessIcon: css`
    & {
      color: ${token.colorInfoHover};
    }
  `,
  defaultSecondGuessIcon: css`
    & {
      color: ${token.colorWarningHover};
    }
  `,
  hardSecondGuessIcon: css`
    & {
      color: ${globalStyles.accentColors.colorPurpleHover};
    }
  `,
  flipped: css`
    transform: rotateY(360deg);
    background-color: ${token.colorInfoBg};
  `,
  1: css`
    max-width: 13rem;
    max-height: 16rem;
    & svg {
      width: 3.7rem !important;
      height: 3.7rem !important;
    }
  `,
  2: css`
    max-width: 13rem;
    max-height: 14rem;
    & svg {
      width: 3.7rem !important;
      height: 3.7rem !important;
    }
  `,
  3: css`
    max-width: 12rem;
    max-height: 16rem;

    & svg {
      width: 3.7rem !important;
      height: 3.7rem !important;
    }
  `,
  4: css`
    max-width: 8.2rem;
    max-height: 10.8rem;

    & svg {
      width: 3rem !important;
      height: 3rem !important;
    }
  `,
  5: css`
    max-width: 8.2rem;
    max-height: 10.8rem;

    & svg {
      width: 3rem !important;
      height: 3rem !important;
    }
  `,
  6: css`
    max-width: 8.2rem;
    max-height: 10.8rem;

    & svg {
      width: 3rem !important;
      height: 3rem !important;
    }
  `,
  inactive: css`
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    animation: fadeOut 1s ease forwards;
  `,
  showDiff: css`
    opacity: 1 !important;
  `,
  valid: css`
    background-color: ${globalStyles.themeColors.colorSuccessBg} !important;
  `,
  invalid: css`
    background-color: ${globalStyles.themeColors.colorErrorBg} !important;
  `,
}));
