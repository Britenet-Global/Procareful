import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,

  button: css`
    width: min-content;
    padding-right: 2rem;
    padding-block: 1rem !important;

    & span {
      color: ${globalStyles.accentColors.colorNeutralActive};
    }
  `,
  spin: css`
    width: 0;
    opacity: 0;
    margin-right: 0;

    transition:
      opacity 0.3s,
      margin-right 0.3s,
      width 0.3s;
  `,
  spinVisible: css`
    opacity: 1;
    margin-right: 1rem;
    width: 1rem;
  `,
}));
