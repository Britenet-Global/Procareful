import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { colorNeutralBorder, colorNeutralActive } = globalStyles.accentColors;

export const useStyles = createStyles(({ css }) => ({
  cardContainer: css`
    .ant-card-head-title {
      max-width: 81rem;
    }
  `,
  form: css`
    margin-top: 2.4rem;
  `,
  newRolesContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 1.6rem;
  `,
  roleDataContainer: css`
    display: flex;
    flex-direction: column;
    row-gap: 0.8rem;
  `,
  select: css`
    max-width: 35rem;
  `,
  modalContainer: css`
    button {
      border-color: ${colorNeutralBorder} !important;
      color: ${colorNeutralActive} !important;
    }
  `,
}));
