import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizeSM } = globalStyles.fontSizes;

export const useStyles = createStyles(({ token, css }) => ({
  modal: css`
    height: 63.7rem !important;
    width: 65.7rem !important;
    margin-bottom: 1.5rem !important;
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
      font-weight: 700 !important;
      color: ${token.colorText};
    }
  `,
  titleContainer: css`
    font-weight: 700 !important;
  `,
  authorInfoTitle: css`
    margin-bottom: 1.6rem !important;
  `,
  authorInfoContainer: css`
    display: flex;
    flex-direction: column;
    margin-top: 0.6rem;
    margin-bottom: 1.6rem;
  `,
  editedText: css`
    margin-left: 0.6rem !important;
    color: ${globalStyles.accentColors.colorNeutralBorderHover};
  `,
  labelsContainer: css`
    margin-bottom: 1.6rem;
  `,
  formContainer: css`
    display: flex;
    flex-direction: column;
    height: 57.3rem;
    width: 100%;
  `,
  buttonsContainer: css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    margin-bottom: 0;
  `,
  editButton: css`
    margin-left: 0.8rem;
  `,
  upload: css`
    .ant-upload-drag-container {
      width: 100%;
      height: 100%;
      display: flex !important;
      justify-content: center;
      flex-direction: column;
    }

    .ant-upload-drag {
      margin-top: 0.8rem !important;
      height: 6.2rem !important;
    }
    .ant-upload-btn {
      padding: 0 !important;
    }
    .ant-upload-list {
      height: 8.7rem;
      overflow-y: auto;
      padding-right: 1.6rem;
    }
  `,
  select: css`
    .ant-select-selection-placeholder {
      color: ${token.colorText};
    }
  `,
  noteContainer: css`
    margin-top: 0.6rem;
    margin-bottom: 1.6rem;
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
