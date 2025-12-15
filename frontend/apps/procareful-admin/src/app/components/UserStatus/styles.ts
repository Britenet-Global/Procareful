import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
  `,
  textContainer: css`
    margin-top: 2.4rem;
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
    margin-top: 2rem;
    column-gap: 0.8rem;
  `,
  modalTextContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
}));
