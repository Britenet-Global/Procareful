import { createStyles } from 'antd-style';
import { globalStyles } from '../../constants';

const {
  colorNeutralBorderHover,
  colorOrangeBorder,
  colorOrangeBg,
  colorOrange,
  colorPurpleBorder,
  colorPurpleBg,
  colorPurple,
} = globalStyles.accentColors;

const { fontSizeSM } = globalStyles.fontSizes;

export const useStyles = createStyles(({ token, css }) => ({
  tag: css`
    border-width: 0.1rem !important;
    border-radius: 0.2rem !important;
    padding: 0.1rem 0.8rem !important;
    font-size: ${fontSizeSM};
    margin-inline: auto;
    line-height: 2rem;
    font-weight: 400;
  `,
  default: css`
    border-color: ${colorNeutralBorderHover} !important;
    background-color: ${token.colorBgLayout} !important;
    color: ${token.colorText} !important;
  `,
  red: css`
    border-color: ${token.colorErrorBorder} !important;
    background-color: ${token.colorErrorBg} !important;
    color: ${token.colorErrorHover} !important;
  `,
  orange: css`
    border-color: ${colorOrangeBorder} !important;
    background-color: ${colorOrangeBg} !important;
    color: ${colorOrange} !important;
  `,
  yellow: css`
    border-color: ${token.colorWarningBorder} !important;
    background-color: ${token.colorWarningBg} !important;
    color: ${token.colorWarningActive} !important;
  `,
  green: css`
    border-color: ${token.colorSuccessBorder} !important;
    background-color: ${token.colorSuccessBg} !important;
    color: ${token.colorSuccess} !important;
  `,
  teal: css`
    border-color: ${token.colorPrimaryBorder} !important;
    background-color: ${token.colorPrimaryBg} !important;
    color: ${token.colorPrimary} !important;
  `,
  blue: css`
    border-color: ${token.colorInfoBorder} !important;
    background-color: ${token.colorInfoBg} !important;
    color: ${token.colorInfoActive} !important;
  `,
  purple: css`
    border-color: ${colorPurpleBorder} !important;
    background-color: ${colorPurpleBg} !important;
    color: ${colorPurple} !important;
  `,
}));
