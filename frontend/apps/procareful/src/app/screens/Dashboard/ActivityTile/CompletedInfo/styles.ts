import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  completedContainer: css`
    display: flex;
    align-items: center;
    gap: 0.7rem;
  `,
  checkIcon: css`
    font-size: 2.2rem !important;
    color: ${globalStyles.themeColors.colorPrimary};
  `,
}));
