import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  modal: css`
    width: 52rem;
    display: flex;
    flex-direction: column;
    box-shadow:
      0px 9px 28px 8px rgba(0, 0, 0, 0.05),
      0px 3px 6px -4px rgba(0, 0, 0, 0.12),
      0px 6px 16px 0px rgba(0, 0, 0, 0.08);
    border-radius: 0.2rem;
  `,
  marginTop: css`
    margin-top: 1.6rem !important;
    display: block;
  `,
}));
