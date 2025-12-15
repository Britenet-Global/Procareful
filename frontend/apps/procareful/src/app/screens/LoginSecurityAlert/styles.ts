import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  institutionDetailsContainer: css`
    display: flex;
    flex-direction: column;
    margin-top: 3.2rem;

    & > span:first-of-type {
      margin-bottom: 0.8rem !important;
    }

    & > span {
      font-size: ${globalStyles.fontSizes.fontSizeLG};
      font-weight: 700 !important;
    }
  `,
}));
