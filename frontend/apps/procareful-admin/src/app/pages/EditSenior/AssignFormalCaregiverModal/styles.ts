import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  modalContainer: css`
    display: flex;
    flex-direction: column;
  `,
  modalTextContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  select: css`
    display: flex;
    margin-top: 1.6rem;
    width: 100%;

    .ant-select-arrow {
      color: ${token.colorText};
    }
  `,
}));
