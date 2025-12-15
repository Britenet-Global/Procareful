import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  headerContainer: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  title: css`
    padding-bottom: 0.4rem;
    font-weight: 700 !important;
  `,
  subtitle: css`
    font-size: ${globalStyles.fontSizes.fontSize};
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  `,
  labelContainer: css`
    margin-top: 0.8rem;
  `,
}));
