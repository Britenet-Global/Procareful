import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    height: auto;
  `,
  troubleSleepingContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  noStylesLabelContainer: css`
    margin-top: 0.8rem;
    .ant-form-item-label > label {
      font-weight: 400 !important;
    }
  `,
  selectWidth: css`
    width: 32rem !important;
  `,
  verticalItem: css`
    & .ant-form-item-label {
      padding-bottom: 0 !important;

      label {
        margin-bottom: 0.8rem !important;
        height: auto !important;
      }
    }
  `,
  verticalItemWithSemiColon: css`
    & label::after {
      visibility: visible !important;
    }
  `,
  textArea: css`
    min-height: 4.8rem !important;

    & > textarea {
      resize: block !important;
    }
  `,
}));
