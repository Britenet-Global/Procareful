import { createStyles, css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizeSM, fontSizeHeading3 } = globalStyles.fontSizes;

export const styles = {
  tag: css`
    margin-right: 0.6rem !important;
    margin-block: 0.2rem;
  `,
  tagText: css`
    font-size: ${fontSizeSM};
  `,
  editIconContainer: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  moreIcon: css`
    font-size: ${fontSizeHeading3} !important;
    color: ${globalStyles.editIcon.color};

    &:hover {
      cursor: pointer;
    }
  `,
  marginBottom: css`
    margin-bottom: 0.4rem !important;
  `,
};

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100% !important;
  `,
  row: css`
    &:hover {
      cursor: pointer;
    }
  `,
}));
