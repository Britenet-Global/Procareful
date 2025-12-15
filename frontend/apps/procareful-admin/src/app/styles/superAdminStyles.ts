import { createStylish } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

type StyleProps = {
  formMode?: 'add' | 'edit';
};

export const useStylish = createStylish(({ css }, props: StyleProps) => ({
  form: css`
    display: flex;
    flex-direction: column;
    row-gap: ${props?.formMode === 'add' && '0.8rem'};
    height: 100%;
  `,
  input: css`
    max-width: 50rem;
  `,
  formTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
    margin: 2.4rem 0 0.8rem !important;
  `,
  buttonContainer: css`
    margin-left: auto;
    display: flex;
    column-gap: 1.6rem;
    margin-top: ${props?.formMode === 'edit' ? '1.4rem' : '2.4rem'};
  `,
  datePicker: css`
    display: flex;
  `,
}));
