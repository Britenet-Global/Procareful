import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  container: css`
    display: flex;
    flex-direction: column;
    row-gap: 2.4rem;
    justify-content: space-between;
    align-items: center;
  `,
  iconContainer: css`
    width: 10rem;
    height: 10rem;
    background: ${globalStyles.accentColors.colorNeutralBorder};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    & > svg {
      font-size: 6rem !important;
      fill: white;
    }
  `,
  centered: css`
    text-align: center !important;
  `,
}));
