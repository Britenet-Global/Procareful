import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, themeColors } = globalStyles;

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    display: flex;
    width: auto;
    height: 7.2rem;
    padding: 0.8rem 2.4rem;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  `,
  greetingContainer: css`
    display: flex;
    align-items: center;
    gap: 0.8rem;

    > .ant-space-item {
      display: flex;
    }
  `,
  iconContainer: css`
    display: flex;
    align-items: center;
    gap: 2.4rem;
  `,
  icon: css`
    color: ${themeColors.colorText} !important;
    cursor: pointer;
    vertical-align: middle;
    font-size: ${fontSizes.fontSizeHeading3} !important;
  `,
  dot: css`
    cursor: pointer;

    & > sup {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: ${fontSizes.fontSize} !important;
    }
  `,
  hand: css`
    margin-right: 0.8rem;
  `,
  arrow: css`
    font-size: ${fontSizes.fontSizeHeading3} !important;

    &:hover {
      cursor: pointer;
    }
  `,
  dropdownContainer: css`
    cursor: pointer !important;
  `,
  dropdown: css`
    width: 24rem;

    .ant-dropdown-menu {
      padding: 0.6rem 0.6rem 1.3rem !important;
    }

    svg {
      width: 1.9rem !important;
      height: 1.9rem !important;
      fill: ${token.colorIcon};
    }

    .ant-dropdown-menu-item {
      padding: 1rem 1.4rem !important;
    }
  `,
}));
