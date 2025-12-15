import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
  `,
}));

export const styles = {
  tagContainer: css`
    display: flex;
    width: min-content;
    justify-content: flex-start;
    column-gap: 0.8rem;
  `,
  tag: css`
    margin: 0.2rem;
  `,
  chevronIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${globalStyles.themeColors.colorIcon};
  `,
};
