import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  search: css`
    width: 27.8rem;
  `,
  editIconContainer: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  editIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${globalStyles.editIcon.color};
  `,
  tag: css`
    margin-inline: 0.2rem;
  `,
}));
