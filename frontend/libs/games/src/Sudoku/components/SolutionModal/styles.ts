import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  modal: css`
    .ant-modal-content {
      padding: 6rem 0 !important;
    }
  `,
  container: css`
    display: flex;
    flex-direction: column;
    gap: 2rem;
  `,
}));
