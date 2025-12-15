import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    justify-content: flex-start !important;
    & .ant-card-body {
      flex-grow: 1 !important;
      & > div {
        flex-grow: 1;
      }
    }
  `,
  select: css`
    width: 18rem;
  `,
  heatMapContainer: css`
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-grow: 1;
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
