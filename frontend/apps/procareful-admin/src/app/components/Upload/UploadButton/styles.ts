import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  uploadContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 0.4rem;
    width: 11.2rem !important;
    height: 11.2rem !important;
  `,
  uploadIcon: css`
    border: 0;
    font-size: 2.8rem !important;
    color: ${token.colorIcon};
  `,
  uploadText: css`
    margin-top: 0.8rem;
    color: ${token.colorTextDescription};
    font-size: ${globalStyles.fontSizes.fontSize} !important;
  `,
}));
