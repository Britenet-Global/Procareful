import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    text-align: center;
  `,
  form: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 3.2rem;
  `,
  phoneNumberContainer: css`
    margin-top: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 0.4rem;
  `,
  phoneNumber: css`
    font-weight: 700 !important;
    color: ${token.colorTextDescription};
    text-align: center;
  `,
}));
