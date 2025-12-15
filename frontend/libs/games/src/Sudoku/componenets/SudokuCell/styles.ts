import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors, themeColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  sudokuCell: css`
    width: 3.7rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${fontSizes.fontSizeHeading6} !important;
    border: 0.1rem solid ${accentColors.colorNeutralBgHover} !important;
    box-sizing: border-box;
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
}));
