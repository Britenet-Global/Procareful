import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  tableHeaderContainer: css`
    display: flex;
    flex-direction: column;
  `,
  dropdownContainer: css`
    margin-block: 1.6rem;
    width: 20rem;

    & .ant-space-item {
      display: flex;
      align-items: center;
    }
  `,
  dropdown: css`
    color: ${globalStyles.themeColors.colorText};

    & > svg {
      color: ${globalStyles.themeColors.colorTextDescription};
    }
  `,
  cardContainer: css`
    height: min-content !important;
  `,
  editIconContainer: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  editIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
    color: ${globalStyles.editIcon.color};
  `,
  iconContainer: css`
    display: flex;
    align-items: center;
    padding: 1rem;
  `,
  search: css`
    width: 27.8rem;
  `,
  textBold: css`
    font-weight: 700 !important;
  `,
}));
