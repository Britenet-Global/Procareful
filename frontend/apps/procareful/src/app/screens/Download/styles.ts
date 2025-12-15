import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    height: auto !important;
    align-self: flex-start;
    margin-top: 9.6rem !important;
  `,
  headerContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 0.8rem;
  `,
  icon: css`
    font-size: 3.2rem;
    margin-bottom: 2.4rem;
  `,
  descriptionContainer: css`
    margin-top: 1.6rem;
    margin-bottom: 3.2rem;
  `,
  recommendedBrowsersInfo: css`
    margin-top: 1.6rem !important;
    font-size: ${globalStyles.fontSizes.fontSizeSM};
    color: ${token.colorTextDescription};
    text-align: center;
    margin-bottom: 0.8rem !important;
  `,
}));
