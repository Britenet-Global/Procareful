import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
    height: 100%;
    flex: 1;

    .ant-form-item {
      width: 100% !important;
    }
  `,
  textArea: css`
    margin-top: 2.4rem;
    width: 100% !important;

    & > textarea {
      resize: block !important;
      min-height: 12.8rem !important;
    }
  `,
  buttonContainer: css`
    margin-top: auto;
  `,
}));
