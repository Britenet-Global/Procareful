import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    border-radius: 0.8rem 0.8rem 0 0;
    box-shadow: ${globalStyles.containerBoxShadow};
  `,
  upperContainer: css`
    width: 100%;
    height: 7.4rem;
    background-color: ${globalStyles.themeColors.colorInfoBg};
    border-radius: 0.8rem 0.8rem 0 0;
    position: relative;
    display: flex;
    justify-content: center;
    padding-top: 2.4rem;
  `,
  iconContainer: css`
    width: 7rem;
    height: 7rem;
    border: 0.6rem solid ${globalStyles.themeColors.colorInfoBg};
    border-radius: 10rem;
    display: grid;
    background-color: ${globalStyles.themeColors.colorBgLayout};
    position: absolute;
    top: -4.4rem;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  `,
  brainIcon: css`
    place-self: center center;
    & svg {
      width: 3.2rem;
      height: 3.2rem;
    }
    & path {
      fill: ${globalStyles.themeColors.colorInfoBorderHover} !important;
    }
  `,
  welcomeText: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading4};
  `,
  bottomContainer: css`
    width: 100%;
    min-height: 9.3rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1rem;
    padding-bottom: 0.5rem;
    background-color: ${globalStyles.themeColors.colorBgContainer};
  `,
  progressContainer: css`
    padding: 0 3.3rem;
    width: 100%;
    max-width: 40rem;
  `,
  description: css`
    text-align: center;
  `,
}));
