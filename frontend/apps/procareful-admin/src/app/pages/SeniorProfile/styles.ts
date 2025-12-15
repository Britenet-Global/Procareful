import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    display: flex;
    height: 100%;
  `,
  left: css`
    width: 30rem;
    height: calc(100vh - 10.2rem);
    position: fixed;
    display: flex;
    align-items: flex-start;
  `,
  right: css`
    flex: 1;
    margin-left: 31.6rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    position: relative;
    overflow-x: auto;
  `,
  activateCardContainer: css`
    padding: 2rem 1.6rem;
    max-height: 7.2rem;
  `,
  alert: css`
    background-color: ${token.colorInfoBg};
    border-radius: 0.4rem;
    width: 100%;
    padding: 1.6rem;
    margin-bottom: 1.6rem;

    & p {
      color: ${token.colorText} !important;
    }
  `,
  tabs: css`
    width: 100% !important;
    overflow-y: auto !important;

    &.ant-tabs,
    .ant-tabs-content,
    .ant-tabs-content-holder,
    .ant-tabs-content .ant-tabs-tabpane {
      height: 100% !important;

      & > .ant-card {
        min-height: 100% !important;
      }
    }
  `,
}));
