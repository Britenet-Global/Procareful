import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const styles = {
  icon: css`
    color: ${globalStyles.accentColors.colorNeutralBorder};
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    margin: 1.2rem;
  `,
};

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    height: 100%;
    width: 100%;
    padding: 1.6rem 1.6rem 2.4rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: ${globalStyles.themeColors.colorBgElevated};
    border-radius: 0.4rem;
    box-shadow: ${globalStyles.containerBoxShadow};

    @media (max-height: ${token.screenMD}px) {
      height: 80%;
    }
  `,
  innerContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  text: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading5};

    @media (max-height: ${token.screenMD}px) {
      font-size: ${globalStyles.fontSizes.fontSize} !important;
    }
  `,
  amount: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading1} !important;

    @media (max-height: ${token.screenMD}px) {
      font-size: ${globalStyles.fontSizes.fontSizeHeading2} !important;
    }
  `,
}));
