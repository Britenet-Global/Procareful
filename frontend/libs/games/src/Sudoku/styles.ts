import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${globalStyles.themeColors.colorBgLayout} !important;
    padding-top: 2.4rem;
    gap: 4rem;
  `,
  spinContainer: css`
    display: flex;
    justify-content: center;
    margin-top: 15rem;
  `,
  summaryWrapper: css`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 90vw;
  `,
  diffButton: css`
    font-size: ${token.fontSize / 10}rem !important;
    width: 100%;
  `,
}));
