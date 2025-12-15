import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  modal: css`
    height: min-content;
    width: 52rem !important;
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
      height: 100%;
      padding-bottom: 3rem !important;
    }

    & > .ant-modal-content > .ant-modal-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .ant-modal-title {
      color: ${token.colorText};
    }
  `,
  labelMargin: css`
    margin-top: 1.6rem;

    & .ant-form-item-label {
      margin-bottom: 1.6rem !important;
      color: ${token.colorText} !important;
    }

    & .ant-form-item-label > label {
      color: ${token.colorText} !important;
    }
  `,
}));
