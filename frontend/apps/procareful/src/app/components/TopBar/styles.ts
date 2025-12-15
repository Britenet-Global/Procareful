import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  topBar: css`
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 2.4rem;
    text-align: center;
  `,
  topBarHorizontallyStretched: css`
    justify-content: space-between;
  `,
  link: css`
    display: flex;
  `,
  topBarCentered: css`
    justify-content: center;
  `,
  topBarElement: css`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    justify-content: center;
    width: 100%;
  `,
  icon: css`
    width: ${globalStyles.fontSizes.fontSizeHeading2} !important;
    height: ${globalStyles.fontSizes.fontSizeHeading2} !important;
    color: ${globalStyles.accentColors.colorNeutralTextActive};
    cursor: pointer;
  `,
  title: css`
    text-align: center !important;
    line-height: 1.5;
  `,
  subtitle: css`
    margin-bottom: 2.4rem !important;
    text-align: center;

    & p {
      font-weight: 700 !important;
    }
  `,
  hideIcon: css`
    cursor: auto;
    visibility: hidden;
  `,
  marginContainer: css`
    min-width: 2.4rem;
  `,
}));
