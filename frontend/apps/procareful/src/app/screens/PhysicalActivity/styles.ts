import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    width: 100%;
    max-width: 60rem;
    height: 100%;
    background-color: ${globalStyles.themeColors.colorBgLayout};
    padding: 0 2rem;
    overflow: scroll;
    overflow-x: hidden;
  `,
  textContainer: css`
    width: 100%;

    & > strong {
      margin-bottom: 0.2rem !important;
    }
  `,
  marginTop: css`
    margin-top: 1rem !important;

    &:last-of-type {
      padding-bottom: 2rem;
    }
  `,
}));
