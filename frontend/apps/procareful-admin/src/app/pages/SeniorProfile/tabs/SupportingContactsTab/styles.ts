import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  familyDoctorContainer: css`
    margin-top: 2.4rem;
  `,
  cardContainer: css`
    & .ant-card-head-title {
      max-width: 71rem;
    }
  `,
}));
