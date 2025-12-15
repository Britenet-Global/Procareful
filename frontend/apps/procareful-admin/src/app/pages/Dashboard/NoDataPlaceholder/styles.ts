import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  icon: css`
    color: #9aa5b1;
    width: 6rem !important;
    height: 6rem !important;
  `,
  description: css`
    color: ${globalStyles.themeColors.colorTextDescription};
    text-align: center;
  `,
}));
