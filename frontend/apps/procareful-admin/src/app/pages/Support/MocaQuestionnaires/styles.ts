import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  cardContainer: css`
    .ant-card-head {
      margin-bottom: 2.4rem !important;
    }
  `,
}));

export const styles = {
  button: css`
    padding-block: 1.6rem;
  `,
  downloadIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${globalStyles.editIcon.color};

    &:hover {
      cursor: pointer;
    }
  `,
};
