import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  input: css`
    max-width: 33rem;
  `,
  label: css`
    & label {
      width: 20rem !important;
    }
  `,
}));
