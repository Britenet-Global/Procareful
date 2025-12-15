import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  modal: css`
    height: min-content;
    width: 65.7rem !important;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 0.2rem;
    background: ${token.colorBgElevated};
    box-shadow:
      0px 9px 28px 8px rgba(0, 0, 0, 0.05),
      0px 3px 6px -4px rgba(0, 0, 0, 0.12),
      0px 6px 16px 0px rgba(0, 0, 0, 0.08);

    .ant-modal-content {
      height: 100%;
      padding-bottom: 3rem !important;
    }

    & > .ant-modal-content > .ant-modal-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .ant-modal-title {
      color: ${token.colorText};
    }
  `,
  titleContainer: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 2.4rem;

    & > h4 {
      color: ${token.colorText};
    }

    & > span:first-of-type {
      color: ${token.colorTextDescription};
      margin-top: 0.4rem !important;
      margin-bottom: 0.8rem !important;
      width: 80%;
    }
    & > span:last-of-type {
      width: 90%;
    }
  `,
  activitiesOverview: css`
    display: flex;
    flex-direction: column;
  `,
  activitiesOverviewTitle: css`
    margin-bottom: 1.6rem;
  `,
  buttonContainer: css`
    display: flex;
    justify-content: flex-end;
  `,
}));
