import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0.4rem;
    padding: 1.6rem 1.6rem 2.4rem;
    background: ${globalStyles.themeColors.colorBgContainer};

    .ant-card-body {
      flex-grow: 1;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .ant-card-head {
      padding: 0;
      justify-content: flex-start;
      padding-top: 0.2rem;
      border-bottom: none;
    }
  `,
  containerFitContent: css`
    .ant-card-body {
      max-height: 80% !important;
    }
  `,
  titleContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  containerFullHeight: css`
    height: 100%;
  `,
  shadow: css`
    box-shadow:
      0 0 1px 0 rgba(98, 125, 152, 0.1),
      1px 2px 2px 0 rgba(98, 125, 152, 0.09),
      3px 4px 3px 0 rgba(98, 125, 152, 0.05),
      6px 7px 4px 0 rgba(98, 125, 152, 0.01),
      9px 12px 4px 0 rgba(98, 125, 152, 0) !important;
  `,
  withoutBorders: css`
    border: none !important;
  `,
}));
