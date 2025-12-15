import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  deactivationContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  actionTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
  `,
  buttonContainer: css`
    display: flex;
    width: min-content;
    column-gap: 0.8rem;
  `,
}));
