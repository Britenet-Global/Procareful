import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
  `,
  paddingBlock: css`
    padding-block: 1.1rem !important;
  `,
  attachments: css`
    color: ${token.colorTextDescription};
  `,
}));
