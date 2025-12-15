import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
    display: flex;
    flex-direction: column;
  `,

  downloadContainer: css`
    max-width: 83rem;
    display: flex;
    flex-direction: column;
  `,
  alert: css`
    height: 5.6rem;
    display: flex;
    justify-content: center;
    margin-block: 2.4rem;

    h6 {
      font-weight: 400;
      font-size: ${globalStyles.fontSizes.fontSize} !important;
    }
  `,
  downloadButton: css`
    width: min-content;
    margin-top: 2.4rem;
  `,
  titleContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  buttonGroup: css`
    margin-top: auto;
  `,
}));
