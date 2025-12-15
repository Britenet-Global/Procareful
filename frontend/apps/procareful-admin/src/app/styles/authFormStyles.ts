import { createStylish } from 'antd-style';

export const useStylish = createStylish(({ css }) => ({
  form: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    & .ant-form-item-explain.ant-form-item-explain-connected {
      padding-bottom: 3.2rem !important;
    }
  `,
  submitButton: css`
    margin-top: 1rem;
  `,
}));
