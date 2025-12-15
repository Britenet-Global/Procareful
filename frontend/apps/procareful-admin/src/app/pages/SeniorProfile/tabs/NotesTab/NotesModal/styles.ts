import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizeSM } = globalStyles.fontSizes;

export const useStyles = createStyles(({ token, css }) => ({
  modal: css`
    height: 63.7rem !important;
    width: 65.7rem !important;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 0.2rem;
    background: ${token.colorBgElevated};
    box-shadow:
      0px 9px 28px 8px rgba(0, 0, 0, 0.05),
      0px 3px 6px -4px rgba(0, 0, 0, 0.12),
      0px 6px 16px 0px rgba(0, 0, 0, 0.08);

    .ant-modal-content {
      padding-bottom: 3rem !important;
    }

    .ant-modal-title {
      color: ${token.colorText};
    }
  `,
  form: css`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .ant-form-item {
      margin-bottom: 1.5rem !important;
    }

    .ant-form-item:last-child {
      margin-bottom: 0rem !important;
    }
  `,
  formContainer: css`
    height: 57.3rem;
    width: 100%;
  `,
  buttonContainer: css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    margin-bottom: 0;
  `,
  submitButton: css`
    margin-left: 0.8rem;
  `,
  text: css`
    padding-bottom: 0.8rem;
  `,
  upload: css`
    display: flex;
    flex-direction: column;

    .ant-upload-drag-container {
      width: 100%;
      height: 100%;
      display: flex !important;
      justify-content: center;
      flex-direction: column;
    }

    .ant-upload-drag {
      margin-top: 0.8rem !important;
      height: clamp(5rem, 5rem, 6rem) !important;
    }
    .ant-upload-btn {
      padding: 0 !important;
    }
    .ant-upload-list {
      height: clamp(7rem, 7rem, 9rem);
      overflow-y: auto;
      margin-top: 1rem;
      padding-right: 1.6rem;
    }
  `,
  select: css`
    .ant-select-selection-placeholder {
      color: ${token.colorText};
    }
  `,
  textArea: css`
    height: 8.6rem !important;

    & > textarea {
      resize: none !important;
    }
  `,
  textAreaUpdate: css`
    height: 12rem !important;
  `,
  uploadTopText: css`
    line-height: 2.2rem;
  `,
  uploadBottomText: css`
    font-size: ${fontSizeSM};
    color: ${token.colorTextDescription};
    line-height: 2.2rem;
  `,
  labelIcon: css`
    color: ${token.colorTextDescription};
    font-size: ${globalStyles.fontSizes.fontSizeLG};
    margin-inline: 0.4rem;
  `,
  labelBracketsText: css`
    color: ${token.colorTextDescription};
  `,
}));
