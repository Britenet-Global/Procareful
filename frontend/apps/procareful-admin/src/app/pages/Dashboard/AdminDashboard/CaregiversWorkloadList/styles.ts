import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  card: css`
    justify-content: flex-start !important;
    & .ant-card-body {
      max-height: 90% !important;
    }
  `,
  listContainer: css`
    width: 100%;
    overflow-y: auto;
    margin-top: 1rem;

    &::-webkit-scrollbar {
      width: 0.8rem !important;
    }
  `,
  select: css`
    width: 18rem;
  `,
  placeholder: css`
    padding-top: 12rem;
    width: 80%;
    margin: 0 auto;
  `,
}));
