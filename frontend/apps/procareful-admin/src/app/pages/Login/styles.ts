import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  icon: css`
    & svg {
      font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
      color: ${globalStyles.editIcon.color} !important;
    }

    &:hover {
      cursor: pointer !important;
    }
  `,
}));
