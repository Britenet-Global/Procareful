import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css, token }) => ({
  mainContainer: css`
    border-color: ${token.colorBorder} !important;
    justify-content: flex-start !important;
    .ant-card-head-title h5 {
      font-size: ${globalStyles.fontSizes.fontSize} !important;
    }
    & .ant-card-body {
      flex-grow: 1 !important;
      overflow-y: auto !important;
    }

    & .ant-card-body:first-child {
      overflow-y: auto !important;
    }
  `,
  select: css`
    width: 18rem;
  `,
  graphContainer: css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  `,
  heatMapContainer: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-grow: 1;
    flex: 1;
  `,
  header: css`
    width: 100%;
    display: flex;
    margin-bottom: 2rem;
  `,
  headerElement: css`
    display: flex;
    flex-direction: column;
    width: 33%;
  `,
  upperText: css`
    color: ${globalStyles.editIcon.color};
  `,
  bottomText: css`
    font-size: ${globalStyles.fontSizes.fontSizeHeading5};
  `,
}));
