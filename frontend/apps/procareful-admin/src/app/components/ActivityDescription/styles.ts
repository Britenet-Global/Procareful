import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    padding-block: 0.8rem;
    margin-block: 0.4rem;
  `,
  descriptionContainer: css`
    margin-left: 2.4rem;
  `,
  activityTitle: css`
    font-size: ${globalStyles.fontSizes.fontSize} !important;
  `,
  tagContainer: css`
    margin-top: 1rem;
  `,
  additionalDescriptionContainer: css`
    margin-top: 1rem;
  `,
  tag: css`
    margin: 0.2rem;
  `,
}));
