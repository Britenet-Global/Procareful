import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes } = globalStyles;

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    height: 59.4rem !important;
  `,
  header: css`
    margin-bottom: 0.8rem;
  `,
  subtitle: css`
    text-align: center;
  `,
  text: css`
    font-size: ${fontSizes.fontSize} !important;
  `,
  iconTextColumn: css`
    margin-left: -0.6rem;
  `,
  icon: css`
    color: ${token.colorIcon};
    font-size: ${fontSizes.fontSizeHeading3} !important;
    margin-top: 0.3rem;
  `,
  divider: css`
    &.ant-divider {
      margin: 3.2rem 0 1.8rem !important;
    }
  `,
  row: css`
    margin-top: 0.8rem;
    padding-inline: 1.4rem;

    &:first-child {
      margin-top: 0;
    }
  `,
}));
