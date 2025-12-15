import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors, themeColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  sudokuCell: css`
    flex: 1;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${accentColors.colorNeutralBgHover};
    width: 100%;
    height: 100%;
    font-size: ${fontSizes.fontSizeHeading4};
    cursor: pointer;

    &:hover {
      background-color: ${accentColors.colorNeutralBorderHover} !important;
    }
  `,
  bottomBorder: css`
    border-bottom: 0.1rem solid ${accentColors.colorNeutral} !important;
  `,
  rightBorder: css`
    border-right: 0.1rem solid ${accentColors.colorNeutral} !important;
  `,
  initialCell: css`
    font-weight: 700;
    color: ${themeColors.colorInfoActive};
    cursor: default !important;
  `,
  selectedRowColSquare: css`
    background-color: ${accentColors.colorNeutralBorder} !important;
  `,
  activeCell: css`
    background-color: ${accentColors.colorNeutralBorderHover} !important;
  `,
  validCell: css`
    background-color: ${themeColors.colorSuccessActive} !important;
    color: ${themeColors.colorPrimaryBg} !important;
  `,
  invalidCell: css`
    background-color: ${themeColors.colorErrorActive} !important;
    color: ${themeColors.colorPrimaryBg} !important;
  `,
}));
