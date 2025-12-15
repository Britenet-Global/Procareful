import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  sudokuBoard: css`
    display: inline-block;
    padding: 0.5rem;
  `,
  sudokuRow: css`
    display: flex;
  `,
  selectedCell: css`
    background-color: ${globalStyles.accentColors.colorBgLayout30} !important;
    z-index: 2 !important;
  `,
  selected: css`
    background-color: ${globalStyles.accentColors.colorOrangeActive} !important;
  `,
}));
