import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { fontSizes, accentColors } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  motivationCard: css`
    .ant-card-head {
      min-height: 4rem !important;
      max-width: 81rem;
    }
  `,
  container: css`
    display: flex;
    flex-direction: column;
  `,

  form: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;

    & .ant-form-item {
      max-width: 60rem !important;
    }
  `,
  cardWithBiggerMargin: css`
    margin-bottom: 3.4rem;
  `,
  qualityOfLifeInputsContainer: css`
    margin-top: 2.4rem;
  `,
  formTitle: css`
    font-size: ${fontSizes.fontSize} !important;
    color: ${accentColors.colorNeutral};
  `,
  generalHealthContainer: css`
    max-width: 60rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  motivationSelect: css`
    max-width: 28.6rem;
    margin-top: 2.4rem;
  `,
}));
