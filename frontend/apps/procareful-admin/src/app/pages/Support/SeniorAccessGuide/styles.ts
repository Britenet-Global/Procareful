import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  textSection: css`
    margin-top: 2.4rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;

    &:first-child {
      margin-top: 0;
    }

    & a {
      color: ${token.colorPrimaryHover} !important;
      text-decoration: underline !important;
    }

    & ul {
      list-style-type: none;
      padding-left: 1rem;
      display: flex;
      flex-direction: column;
      row-gap: 0.8rem;

      & > li {
        position: relative;
        padding-left: 1.3rem;

        &::before {
          content: '•';
          font-size: ${globalStyles.fontSizes.fontSizeLG};
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  `,
  subBulletList: css`
    margin-left: 2rem;
  `,
}));
