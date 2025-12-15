import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  addIcon: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    color: ${token.colorIcon};
  `,
  addContactButton: css`
    height: 6.2rem;
    max-width: 70.9rem !important;
    padding: 2rem 2.4rem;
    background-color: unset !important;
    border: none !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    position: relative;
    z-index: 999 !important;

    &:hover {
      background-color: unset !important;
      border-color: unset !important;
      color: unset !important;
    }
  `,
}));
