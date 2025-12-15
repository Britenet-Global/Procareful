import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  container: css`
    height: auto;
  `,
  form: css`
    display: flex;
    flex-direction: column;
  `,
  formTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
    margin-block: 1rem;
  `,
  marginTop: css`
    margin-top: 1rem;
  `,
  select: css`
    width: 100%;
    margin-bottom: 2.4rem;
  `,
  alert: css`
    min-height: 3.8rem !important;
    padding: 0.8rem 1.6rem !important;
    display: flex;
    align-items: center;
    max-width: 71rem;
    margin: 2.4rem 0;

    .ant-alert-icon {
      width: 1.3rem;
      height: 1.3rem;
    }
  `,
}));
