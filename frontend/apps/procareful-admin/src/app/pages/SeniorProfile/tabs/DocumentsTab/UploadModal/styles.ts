import { createStyles } from 'antd-style';
import { i18n } from '@Procareful/common/i18n';
import { globalStyles } from '@Procareful/ui';

type StyleProps = {
  showDocumentsLabel: boolean;
};

export const useStyles = createStyles(
  ({ token, css }, { showDocumentsLabel = false }: StyleProps) => ({
    modalContainer: css`
      .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: 42rem !important;
        width: 66rem !important;
      }

      .ant-modal-body {
        height: 100% !important;
      }
      .ant-modal-footer {
        margin-top: 0 !important;
      }
    `,
    footerContainer: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    error: css`
      color: ${token.colorError};
    `,
    upload: css`
      display: flex;
      flex-direction: column;
      height: 100%;

      .ant-upload .ant-upload-drag,
      .ant-upload-wrapper,
      .ant-upload-drag,
      .ant-upload-btn {
        height: 100% !important;
      }

      .ant-upload ant-upload-drag {
        width: 100%;
      }
      .ant-upload-drag-container {
        width: 100%;
        display: flex !important;
        justify-content: center;
        flex-direction: column;
      }

      .ant-upload-drag {
        margin-top: 0.8rem !important;
      }
      .ant-upload-btn {
        padding: 0 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
      }

      .ant-upload-list {
        padding-right: 1.6rem;
      }

      .ant-upload-list.ant-upload-list-text::before {
        margin-top: ${showDocumentsLabel ? '1.6rem' : '0'};
        margin-bottom: ${showDocumentsLabel ? '0.8rem' : '0'};
        content: '${showDocumentsLabel ? i18n.t('admin_title_documents') : ''}';
      }
    `,
    uploadTopText: css`
      line-height: 2.2rem;
    `,
    uploadBottomText: css`
      font-size: ${globalStyles.fontSizes.fontSizeSM};
      color: ${token.colorTextDescription};
      line-height: 2.2rem;
    `,
    moreIcon: css`
      padding: 0.4rem;

      &:hover {
        cursor: pointer;
      }
    `,
  })
);
