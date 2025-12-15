import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
    border: 0.1rem solid ${token.colorBorder};
    border-radius: 0.4rem;
    padding: 1.2rem 1.6rem;
  `,
  titleContainer: css`
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    align-items: center;
  `,
  title: css`
    color: ${token.colorTextHeading};
  `,
  subtitle: css`
    font-size: ${globalStyles.fontSizes.fontSizeLG} !important;
    color: ${token.colorTextHeading};
    text-align: left !important;
  `,
  icon: css`
    color: ${token.colorIcon};
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
  `,
}));
