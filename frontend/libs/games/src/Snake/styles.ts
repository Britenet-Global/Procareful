import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    max-width: 60rem;
    background-color: ${globalStyles.themeColors.colorBgLayout};
  `,
}));
