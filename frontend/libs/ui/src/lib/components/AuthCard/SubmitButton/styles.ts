import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  submitButton: css`
    margin-top: auto;
    width: 100%;
    height: 4rem;
    font-size: ${globalStyles.fontSizes.fontSizeLG};
  `,
}));
