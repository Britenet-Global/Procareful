import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    & .ant-form-item-label {
      font-weight: 700;
    }

    & .ant-radio-group {
      display: flex;
      flex-direction: column;
    }

    & .ant-radio-wrapper {
      margin-bottom: 0.8rem;
    }
  `,
  radioDescription: css`
    margin-left: 0.4rem !important;
    color: ${globalStyles.themeColors.colorTextDescription};
  `,
  radioBottomDescription: css`
    color: ${globalStyles.themeColors.colorTextDescription};

    &:first-of-type {
      margin-bottom: 0.8rem !important;
    }
  `,
  columnContainer: css`
    display: flex;
    flex-direction: column;
  `,
  decreasedMargin: css`
    margin-bottom: 0.4rem !important;
  `,
  marginLeft: css`
    margin-left: 1.6rem;
  `,
  radioGroupContainer: css`
    display: flex;
    flex-direction: column;
    width: max-content;
  `,
}));
