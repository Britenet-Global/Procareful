import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  list: css`
    margin-top: 1.6rem;
    max-width: 70.9rem;

    & .ant-list-empty-text {
      padding: 0 !important;
    }
    & .ant-list-footer {
      padding: 0 !important;
    }
  `,

  removeUserDataContainer: css`
    display: flex;
    flex-direction: column;
  `,
}));
