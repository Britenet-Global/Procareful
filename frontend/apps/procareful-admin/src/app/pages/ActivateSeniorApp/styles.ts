import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors } = globalStyles;

export const useStyles = createStyles(({ css, token }) => ({
  skeleton: css`
    height: 3.77rem !important;

    & > span {
      width: 9rem !important;
    }
  `,
  cardContainer: css`
    align-items: flex-start !important;
  `,
  itemContainer: css`
    align-items: flex-start !important;
  `,
  qrCodeContainer: css`
    display: flex;
    align-items: center;
    column-gap: 1.6rem;
  `,
  sendLinkButton: css`
    padding: 0.1rem 1rem;
    width: min-content;
    color: ${accentColors.colorNeutralActive};

    & .ant-btn-loading-icon {
      width: 1.5rem;
      height: auto;
    }
  `,
  textContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  securityCodeContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.4rem;
    margin-top: 1.6rem;
  `,
  text: css`
    color: ${token.colorTextHeading};
  `,
  securityCodeTitle: css`
    color: ${token.colorTextDescription};
  `,
  securityCode: css`
    display: flex;
    color: ${token.colorTextDescription};
    font-size: ${globalStyles.fontSizes.fontSizeHeading3} !important;
    font-weight: 700 !important;
  `,
  securityCodeBold: css`
    color: ${token.colorText};
  `,
  qrCode: css`
    & .ant-upload-list-item {
      padding: 0 !important;
    }

    & .ant-upload-list-item::before,
    .ant-upload-list-item-container {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
    }
  `,
  qrCodeImage: css`
    & .ant-image-preview-img {
      width: 25rem !important;
      height: 25rem !important;
    }
  `,
}));
