import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  nameContainer: css`
    margin-bottom: 1.2rem;
  `,
  statusContainer: css`
    display: flex;
    flex-direction: column;
    max-width: 81rem;
  `,
  statusRow: css`
    display: flex !important;
    align-items: flex-start !important;
    column-gap: 3.2rem;

    .ant-form-item {
      margin-right: 2.4rem;
    }

    & input {
      margin-left: 0.4rem;
      min-width: 16.4rem !important;
    }
  `,
  textContainer: css`
    display: flex;
    flex-direction: column;

    & button {
      width: min-content;
    }
  `,
  changeInstitutionNameContent: css`
    margin: 0.8rem 0 1.6rem !important;
  `,
  actionTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
  `,
}));
