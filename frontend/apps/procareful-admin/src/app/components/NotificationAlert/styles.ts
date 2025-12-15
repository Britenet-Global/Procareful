import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors } = globalStyles;

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 2.3rem 1.6rem;
    margin-bottom: 1.6rem;
    border-radius: 0.4rem;
  `,
  headerContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  descriptionContainer: css`
    max-width: 74rem;
    margin: 0.8rem 0 1.6rem;
  `,
  button: css`
    width: min-content;
  `,
  icon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
  `,
  warning: css`
    background-color: ${accentColors.alertBgColor};
    color: ${accentColors.alertTextColor} !important;

    h6 {
      color: ${accentColors.alertTextColor} !important;
    }

    & svg {
      color: ${token.colorError};
    }
  `,

  description: css`
    color: ${accentColors.alertTextColor};
  `,
}));
