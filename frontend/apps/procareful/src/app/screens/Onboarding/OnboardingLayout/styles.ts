import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

const { fontSizes, themeColors, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: ${themeColors.colorBgLayout};
  `,
  centeredContainer: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 60rem;
    padding: 3.2rem 2rem 4.8rem;
    background-color: ${themeColors.colorBgLayout};
  `,
  logoContainer: css`
    display: flex;
    justify-content: center;
    width: 100%;
  `,
  icon: css`
    font-size: ${fontSizes.fontSizeHeading3};
    margin-right: 0.8rem;
  `,
  buttonContainer: css`
    width: 100%;
  `,
  submitButton: css`
    width: 100%;
    height: 4rem;
    font-size: ${fontSizes.fontSizeLG};
  `,
  carouselButtons: css`
    font-size: ${fontSizes.fontSizeLG};
    border: none;
    background: none !important;
    box-shadow: none !important;
  `,
  carouselDots: css`
    height: 0.3rem;
    width: 3.6rem;
    background: ${accentColors.colorNeutralBgHover};
  `,
  carouselActiveDot: css`
    background: ${themeColors.colorPrimaryActive};
  `,
  childrenComponent: css`
    width: 100%;
    height: 100%;
  `,
  stepComponent: css`
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.7rem;
    width: 100%;
  `,
}));
