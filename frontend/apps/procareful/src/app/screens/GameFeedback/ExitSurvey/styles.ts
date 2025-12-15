import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    height: 100%;

    & form {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    button {
      margin-top: auto;
      width: 100%;
    }
  `,
  formContainer: css`
    width: 100%;

    & > div {
      width: 100%;
    }
  `,
  checkboxGroup: css`
    .ant-checkbox-group {
      margin-top: 2rem;
      row-gap: 2.4rem !important;
    }

    .ant-form-item-label {
      text-align: left;
    }
  `,
}));
