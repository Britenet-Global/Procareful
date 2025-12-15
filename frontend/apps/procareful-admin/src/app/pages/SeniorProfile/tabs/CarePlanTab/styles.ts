import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  cardContainer: css`
    & > .ant-card-body {
      display: flex;
      justify-content: flex-start !important;
      align-items: center;
      height: min-content;
    }
  `,
  centeredContent: css`
    & > .ant-card-body {
      justify-content: center !important;
      align-items: center;
    }
  `,
  fullHeightContainer: css``,
  cardTitleContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & button {
      display: flex;
      align-items: center;
      color: ${globalStyles.accentColors.colorNeutralActive};
    }
  `,
  placeholderContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3.2rem;
    max-width: 43rem;

    @media (max-width: ${token.screenXLMax}px) {
      margin-top: 0;
    }
  `,
  placeholderIcon: css`
    font-size: 6.4rem !important;
    color: ${globalStyles.accentColors.colorNeutralBorderHover};
  `,
  placeholderTitle: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
    margin: 1.6rem 0 0.8rem;
  `,
  placeholderSubtitle: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
    margin-bottom: 1.6rem !important;
    color: ${token.colorTextDescription};
  `,

  iconBackground: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 0.4rem;
  `,

  physicalIconBackground: css`
    background-color: ${globalStyles.accentColors.colorPurpleBg};
  `,
  breathingIconBackground: css`
    background-color: ${globalStyles.themeColors.colorInfoBg};
  `,
  cognitiveIconBackground: css`
    background-color: ${globalStyles.themeColors.colorPrimaryBg};
  `,

  icon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
  `,
  physicalIcon: css`
    color: ${globalStyles.accentColors.colorPurple};
  `,
  breathingIcon: css`
    color: ${globalStyles.themeColors.colorInfo};
  `,
  cognitiveIcon: css`
    color: ${globalStyles.themeColors.colorPrimaryHover};
  `,
}));
