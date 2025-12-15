import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ token, css }) => ({
  container: css`
    padding: 0;
    display: flex;
    margin-bottom: 1rem;
    overflow: hidden;

    .ant-card-body {
      display: flex;
      flex-direction: row !important;
    }
  `,
  accentColor: css`
    max-width: 0.8rem;
    min-width: 0.8rem;
    flex-grow: 1;
  `,
  cognitive: css`
    background-color: ${token.colorSuccessBgHover} !important;
  `,
  physical: css`
    background-color: ${token.colorInfoBgHover} !important;
  `,
  social: css`
    background-color: ${token.colorPrimaryBgHover} !important;
  `,
  columnContainer: css`
    display: flex;
    flex-direction: column;
    padding: 1.6rem 2.4rem 1.6rem 1.6rem;
  `,
  headingText: css`
    font-weight: 700 !important;
    font-size: ${globalStyles.fontSizes.fontSize};
    text-align: left;
  `,
  descriptionText: css`
    text-align: left;
  `,
  durationText: css`
    margin-top: 1.6rem !important;
    text-align: left;
  `,
}));
