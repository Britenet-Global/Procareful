import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const styles = {
  editIconContainer: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  editIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${globalStyles.editIcon.color} !important;
  `,
  tag: css`
    margin: 0.2rem;
  `,
};

export const useStyles = createStyles(({ css }) => ({
  container: css`
    > .ant-card {
      margin-top: 1.6rem;

      &:first-child {
        margin-top: 0;
      }
    }
  `,
  search: css`
    width: 27.8rem;
  `,
}));
