import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${globalStyles.themeColors.colorBgLayout};
  `,
  centeredContainer: css`
    width: 100%;
    max-width: 60rem;
    height: 100%;
    background-color: ${globalStyles.themeColors.colorBgLayout};
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  `,
  spinner: css`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4rem;
  `,
}));
