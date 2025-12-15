import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  list: css`
    margin-top: 1.6rem;
    max-width: 70.9rem;

    & .ant-list-empty-text {
      padding: 0 !important;
    }
    & .ant-list-footer {
      padding: 0 !important;
    }
  `,
  select: css`
    .ant-select-selection-placeholder {
      color: ${accentColors.colorNeutralTextActive} !important;
    }
  `,
  checkbox: css`
    & .ant-form-item-explain {
      margin-top: -0.5rem !important;
    }
  `,
  informalCaregiverExistModal: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
  `,
}));
