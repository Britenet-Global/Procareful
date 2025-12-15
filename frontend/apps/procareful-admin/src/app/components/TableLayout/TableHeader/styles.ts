import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  `,
  titleContainer: css`
    display: flex;
    height: 100%;
    flex-direction: column;
    row-gap: 2.4rem;
  `,
  row: css`
    display: flex;
    align-items: center;
  `,
  title: css`
    font-weight: 700 !important;
  `,
  subtitle: css`
    margin-top: 2.4rem;
  `,

  redirectionTitle: css`
    margin-left: 1.2rem;

    & > span {
      color: ${globalStyles.accentColors.colorNeutralActive};
    }
  `,
  actionContainer: css`
    height: 100%;
    display: flex;
    align-items: center;
  `,
  checkbox: css`
    vertical-align: middle;
    font-size: ${globalStyles.fontSizes.fontSize};
    font-weight: 400;
    margin-right: 1rem;
  `,
  search: css`
    margin-right: 1.6rem;
    width: clamp(20rem, 39.2rem, 39.2rem);
    font-weight: 400;
  `,
  dropdownWithMargin: css`
    margin-right: 1.6rem;
    width: 19.6rem !important;

    &:last-child {
      margin-right: 0 !important;
    }

    & .ant-select-selection-placeholder {
      font-weight: 400 !important;
      color: ${token.colorText} !important;
    }
  `,
  button: css`
    color: ${globalStyles.accentColors.colorNeutralActive} !important;
    display: flex;
    align-items: center;

    .ant-btn-icon > svg {
      font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
      color: ${globalStyles.editIcon.color};
    }
  `,
}));
