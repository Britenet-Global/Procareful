import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .ant-form-item-label > label {
      font-weight: 700;
      margin-bottom: 0.8rem;
      line-height: 2.2rem;
    }
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 2.4rem;
    margin-top: auto;
  `,
}));
