import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes } = globalStyles;

export const useStyles = createStyles(({ css, token }) => ({
  sider: css`
    height: 100vh !important;
    width: 22rem !important;
    min-width: 22rem !important;

    .ant-layout-sider-children {
      height: 100vh !important;
      width: 22rem !important;
      min-width: 22rem !important;
    }
  `,
  adminSider: css`
    min-width: 11.4rem !important;
    max-width: 11.4rem !important;

    .ant-layout-sider-children {
      width: 11.4rem !important;
      min-width: 11.4rem !important;
    }
  `,
  logoContainer: css`
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 2.4rem;
  `,
  adminLogoContainer: css`
    justify-content: center;
  `,
  logoText: css`
    color: ${token.colorPrimaryBg};
    font-weight: ${token.fontWeightStrong};
    font-size: ${fontSizes.fontSizeHeading4} !important;
    padding: 0.8rem;
  `,
  versionContainer: css`
    display: flex;
    flex-direction: column;

    & > span {
      color: ${globalStyles.accentColors.colorNeutralBg} !important;
    }
  `,
  logoIcon: css`
    font-size: ${fontSizes.fontSizeHeading4};
  `,
}));
