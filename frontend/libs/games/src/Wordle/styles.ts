import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    margin-top: 2.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${globalStyles.themeColors.colorBgLayout} !important;
  `,
  spinContainer: css`
    position: absolute;
    top: 35vh;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10rem;
  `,
  diffButton: css`
    margin-top: 2rem;
    width: min(80vw, 50rem);
  `,
}));
