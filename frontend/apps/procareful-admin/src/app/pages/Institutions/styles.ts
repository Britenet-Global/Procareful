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
    color: ${globalStyles.themeColors.colorTextDescription};
  `,
};

export const useStyles = createStyles(({ css }) => ({
  tableContainer: css`
    margin-right: 2.4rem !important;

    .ant-table-tbody > tr:last-child > td {
      border-inline-end: none !important;
    }
  `,
}));
