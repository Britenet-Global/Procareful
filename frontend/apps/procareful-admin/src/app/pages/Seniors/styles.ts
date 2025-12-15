import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  search: css`
    font-weight: 400;
    width: 27.8rem;

    > .ant-btn-icon {
      color: ${globalStyles.themeColors.colorText};
    }
  `,
}));

export const styles = {
  chevronIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${globalStyles.themeColors.colorIcon};
  `,
  tagContainer: css`
    display: flex;
    justify-content: flex-start;
    column-gap: 0.8rem;
    width: min-content;
  `,
};
