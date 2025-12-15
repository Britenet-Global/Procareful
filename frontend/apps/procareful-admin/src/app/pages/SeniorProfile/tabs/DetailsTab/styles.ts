import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  formContainer: css`
    display: flex;
    flex-direction: column;
  `,
  form: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem !important;
  `,
  addressTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
    margin-bottom: 0.8rem;
  `,
  inputsContainer: css`
    display: flex;
    column-gap: 6rem;
  `,
  inputWide: css`
    width: 37.6rem;
  `,
  inputShort: css`
    width: 16.4rem;
  `,
  buttonContainer: css`
    position: absolute;
    top: 0;
    right: 1.6rem;
  `,
}));
