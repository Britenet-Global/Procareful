import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  keyboard: css`
    margin: 1.8rem auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  `,
  keyboardRow: css`
    display: flex;
    width: min(80vw, 50rem);
    margin-bottom: 1.2rem;
    gap: 0.4rem;
  `,
  keyboardButton: css`
    flex-grow: 1;
    height: 4.6rem;
    border-radius: 0.6rem !important;
    font-size: ${globalStyles.fontSizes.fontSizeHeading5} !important;
    font-weight: 700;
    background-color: ${globalStyles.themeColors.colorBgContainer} !important;
    border: 0.1rem solid ${globalStyles.accentColors.colorNeutralBg} !important;
    box-shadow: ${globalStyles.containerBoxShadow} !important;
    box-sizing: border-box;
  `,
  specialButton: css`
    background-color: ${globalStyles.gamesColors.lightGreySpecialButton} !important;
  `,
  icon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading5} !important;
  `,
}));
