import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    align-items: flex-start;
    align-items: center;
    padding: 2.4rem;
    gap: 1.6rem;
    margin-bottom: 1.6rem;
  `,
  verticallyCentered: css`
    align-items: center;
  `,
  alignTop: css`
    align-items: flex-start;
  `,
  warning: css`
    background-color: ${token.colorErrorBg};
  `,
  success: css`
    background-color: ${token.colorSuccessBg};
  `,
  info: css`
    background-color: ${token.colorInfoBg};
  `,
  default: css`
    padding: 0;
  `,
  icon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
  `,
  iconSuccess: css`
    color: ${token.colorSuccess};
  `,
  iconWarning: css`
    color: ${token.colorErrorBorderHover};
  `,
  iconInfo: css`
    color: ${token.colorInfo};
  `,
  textContainer: css`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  `,
  header: css`
    font-size: ${globalStyles.fontSizes.fontSize} !important;
  `,
  buttonContainer: css`
    width: 100%;
    margin-top: 1.2rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
  `,
  cancelButton: css`
    &:hover {
      border-color: ${globalStyles.accentColors.colorNeutralBorderHover} !important;
      color: ${globalStyles.accentColors.colorNeutralTextHover} !important;
    }
  `,
}));
