import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    margin-bottom: 1.6rem;
  `,
  stepCompleted: css`
    border: 1px solid ${token.colorSuccessBorder};
  `,
  cardContainer: css`
    background: ${accentColors.colorNeutralBg};
    padding: 0;
    box-shadow:
      26px 30px 16px rgba(98, 125, 152, 0.01),
      15px 17px 13px rgba(98, 125, 152, 0.05),
      7px 7px 10px rgba(98, 125, 152, 0.09),
      2px 2px 5px rgba(98, 125, 152, 0.1) !important;
  `,
  itemsContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
  `,
  icon: css`
    color: ${token.colorText};
    font-size: ${fontSizes.fontSizeHeading3} !important;
    cursor: pointer;
    position: absolute;
    top: 1.6rem;
    right: 1.6rem;
  `,
  iconCompleted: css`
    color: ${token.colorSuccessBorderHover};
    font-size: ${fontSizes.fontSizeHeading1} !important;
  `,
  collapse: css`
    background: ${accentColors.colorNeutralBg} !important;

    .ant-collapse-header {
      padding: 1.6rem !important;
    }

    .ant-collapse-expand-icon {
      order: 0 !important;
      padding-inline-start: 0 !important;
    }
  `,
  loader: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
    width: 100%;
  `,
}));
