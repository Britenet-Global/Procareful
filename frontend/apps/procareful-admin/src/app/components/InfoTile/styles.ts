import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ token, css }) => ({
  itemsContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
    margin-top: 1.6rem;
    background: ${accentColors.colorNeutralBg} !important;
  `,
  itemContainer: css`
    background: ${token.colorBgContainer};
    border-radius: 0.2rem;
    padding: 0.8rem 1.6rem;
    display: flex;
    column-gap: 2.4rem;
    align-items: center;
    border: 1px solid transparent;
  `,
  itemContainerWithShadow: css`
    box-shadow: ${globalStyles.containerBoxShadow};
  `,
  itemIndex: css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 4rem;
    height: 4rem;
    font-weight: 700;
    border-radius: 0.4rem;
    background: ${accentColors.colorNeutralBg};
    color: ${accentColors.colorNeutralText};
    font-size: ${fontSizes.fontSizeHeading6} !important;
  `,
  textContent: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.4rem;
  `,
  title: css`
    color: ${token.colorText};
    font-size: ${fontSizes.fontSizeHeading6} !important;
  `,
  subtitle: css`
    color: ${token.colorTextHeading} !important;
    font-size: ${fontSizes.fontSize} !important;
  `,
  iconContainer: css`
    margin-left: auto;
    min-width: 3.8rem;
    min-height: 3.8rem;
    display: flex;
    align-items: center;
  `,
  icon: css`
    color: ${accentColors.colorNeutralActive};
    font-size: ${fontSizes.fontSizeHeading3} !important;
  `,
  iconCompleted: css`
    color: ${token.colorSuccessBorderHover};
    font-size: ${fontSizes.fontSizeHeading1} !important;
  `,
}));
