import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { gamesColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  keyboardContainer: css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
  `,
  btn: css`
    flex: 1 0;
    margin: 0.6rem;
    box-sizing: border-box;
    max-width: 4.4rem;
    height: 4.4rem;
    background: transparent;
    text-transform: uppercase;
    cursor: pointer;
    color: ${globalStyles.themeColors.colorText} !important;
    font-size: ${fontSizes.fontSizeXL} !important;
    font-weight: bold;
    border-radius: 0.6rem;
    border-color: ${gamesColors.borderGrey} !important;
    box-shadow: ${globalStyles.containerBoxShadow} !important;
  `,

  activeBtn: css`
    background: ${globalStyles.themeColors.colorInfoBg} !important;
  `,
  inactiveBtn: css`
    background: ${globalStyles.accentColors.colorOrangeBg} !important;
  `,
}));
