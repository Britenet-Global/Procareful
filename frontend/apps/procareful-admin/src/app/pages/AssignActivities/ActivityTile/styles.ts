import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;

    & > .ant-card-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    & > .ant-card-body::before,
    .ant-card-body::after {
      display: none;
    }
  `,
  buttonContainer: css`
    display: flex;
    justify-content: space-between;
  `,
  tagContainer: css`
    display: flex;
    align-items: center;

    & > span {
      margin-left: 0.8rem;
    }
  `,
  headerContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  logoContainer: css`
    display: flex;
    align-items: center;
  `,
  colorContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.4rem;
    width: 3.2rem;
    height: 3.2rem;
  `,
  tealBackground: css`
    background: ${globalStyles.themeColors.colorPrimaryBg} !important;
  `,
  lightOrangeBackground: css`
    background: ${globalStyles.accentColors.colorOrangeBg} !important;
  `,
  marginContainer: css`
    margin-inline: 0.4rem;
    background: ${globalStyles.themeColors.colorPrimaryBg} !important;
  `,
  greenBorder: css`
    border-color: ${globalStyles.themeColors.colorSuccessBorder} !important;
  `,
  logoIcon: css`
    margin: 0.8rem;
    font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
  `,
  smileIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
    color: ${globalStyles.accentColors.colorNeutralActive};
  `,
  descriptionContainer: css`
    width: 80%;
    margin-top: 1.6rem;
    margin-bottom: 3.2rem;
  `,
  button: css`
    color: ${globalStyles.accentColors.colorNeutralActive} !important;
  `,
  detailsButton: css`
    display: flex;
    align-items: center;
    padding-inline: 1.6rem;
    color: ${globalStyles.accentColors.colorNeutralActive};
  `,
}));
