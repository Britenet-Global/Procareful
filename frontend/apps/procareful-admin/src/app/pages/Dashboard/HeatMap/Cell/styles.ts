import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const cellHeight = '2rem';
const cellMargin = '0.2rem';

type StyleProps = {
  color: string;
};

export const useStyles = createStyles(({ css }, { color }: StyleProps) => ({
  cell: css`
    height: ${cellHeight};
    flex-grow: 1;
    min-width: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: ${cellMargin};
    border-radius: 2px;
    background-color: ${color};
  `,
  tooltipText: css`
    color: ${globalStyles.themeColors.colorText};
    font-size: ${globalStyles.fontSizes.fontSizeSM};
  `,
}));
