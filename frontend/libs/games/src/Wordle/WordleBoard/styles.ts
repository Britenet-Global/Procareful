import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: min(80vw, 50rem);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-auto-rows: 1fr;
  `,
  letterBox: css`
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.6rem !important;
    margin: 0.3rem 0.2rem;
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    border: 0.1rem solid ${globalStyles.gamesColors.borderGray} !important;
    font-weight: 700;
    background-color: ${globalStyles.themeColors.colorBgContainer} !important;
    box-sizing: border-box;
    box-shadow: ${globalStyles.containerBoxShadow} !important;
  `,
  correct: css`
    background-color: ${globalStyles.themeColors.colorInfoBg} !important;
  `,
  present: css`
    background-color: ${globalStyles.accentColors.colorOrangeBg} !important;
  `,
}));
