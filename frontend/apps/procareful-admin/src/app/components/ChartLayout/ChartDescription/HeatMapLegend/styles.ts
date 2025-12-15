import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    align-items: center;
    margin-left: auto;
  `,
  elementsContainer: css`
    display: flex;
    justify-content: space-between;
    margin: 0 1rem !important;
  `,
  element: css`
    width: 2.3rem;
    height: 2.3rem;
    margin: 0 0.2rem;
    border-radius: 0.1rem;
  `,
  tooltipText: css`
    color: ${globalStyles.themeColors.colorText};
  `,
  firstElement: css`
    background-color: ${globalStyles.accentColors.colorNeutralBgHover};
  `,
  secondElement: css`
    background-color: ${globalStyles.themeColors.colorSuccessBg};
  `,
  thirdElement: css`
    background-color: ${globalStyles.themeColors.colorSuccessBgHover};
  `,
  fourthElement: css`
    background-color: ${globalStyles.themeColors.colorSuccessBorderHover};
  `,
  fifthElement: css`
    background-color: ${globalStyles.themeColors.colorSuccess};
  `,
  text: css`
    font-size: ${globalStyles.fontSizes.fontSizeSM};
    width: fit-content;
    text-wrap: nowrap;
  `,
}));
