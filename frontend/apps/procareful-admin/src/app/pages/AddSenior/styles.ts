import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
  `,
  formContainer: css`
    display: flex;
    flex-direction: column;
  `,
  form: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem !important;
    height: 100%;
  `,
  contactContainer: css`
    margin-top: 4rem;
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
}));
