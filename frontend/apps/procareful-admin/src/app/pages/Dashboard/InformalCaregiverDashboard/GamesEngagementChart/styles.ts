import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    justify-content: flex-start !important;
    height: 100%;

    & .ant-card-body {
      flex-grow: 1 !important;
      justify-content: space-between !important;
      height: 100%;
    }

    & .ant-card-body:after,
    & .ant-card-body:before {
      display: none;
    }
  `,
  select: css`
    width: 18rem;
    .ant-select-selection-placeholder {
      font-weight: 400 !important;
      color: ${globalStyles.themeColors.colorText};
    }
  `,
  heatMapContainer: css`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
  `,
  header: css`
    width: 100%;
    display: flex;
  `,
  addMargin: css`
    margin-bottom: 4rem;
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
