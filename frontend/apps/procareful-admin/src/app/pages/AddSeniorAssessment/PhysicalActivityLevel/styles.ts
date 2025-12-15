import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  input: css`
    max-width: 25rem;
  `,
  inputContainerWithCheckbox: css`
    .ant-form-item {
      display: flex;
      flex-direction: column;
    }
  `,
}));
