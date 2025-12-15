import { globalStyles } from '@Procareful/ui';
import { createStyles, css } from 'antd-style';

export const styles = {
  icon: css`
    min-width: 2.4rem !important;
    font-size: 2.4rem !important;
  `,
  purple: css`
    color: #653cad;
  `,
  blue: css`
    color: #62b0e8;
  `,
};

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: ${globalStyles.themeColors.colorBgLayout};
  `,
  centeredContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 60rem;
    min-height: 100vh;
    background-color: ${globalStyles.themeColors.colorBgLayout};
    padding: 0 2rem;
    overflow: auto;
    overflow-x: hidden;
  `,
  container: css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 2.4rem;
  `,
  loadingContainer: css`
    justify-content: center !important;
    height: 100%;
    margin-bottom: 4rem;
  `,
}));
