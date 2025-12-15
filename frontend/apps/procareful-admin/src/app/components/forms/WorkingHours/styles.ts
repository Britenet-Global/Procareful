import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  form: css`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
  `,
  formTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
    margin-block: 1rem;
  `,
  select: css`
    width: 100%;
    margin-bottom: 2.4rem;
  `,
  checkboxContainer: css`
    margin-block: 2.4rem;
  `,
}));
