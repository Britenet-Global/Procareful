import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    margin-top: 2.4rem;
    width: max-content;

    & .ant-form-item-label {
      font-weight: 700;
    }

    & .ant-checkbox-group {
      display: flex;
      flex-direction: column;
    }

    & .ant-checkbox-wrapper {
      margin-bottom: 0.8rem;
    }
  `,
  checkboxGroupContainer: css`
    display: flex;
    flex-direction: column;

    .ant-form-item-row {
      flex-direction: column;
    }
  `,
  marginLeft: css`
    margin-left: 1.6rem;
  `,
}));
