import { css } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { accentColors } = globalStyles;

export const styles = {
  listItemContainer: css`
    display: flex;
    flex-direction: column;
  `,
  paragraphMark: css`
    color: ${accentColors.colorNeutralBorderHover} !important;
  `,
  itemActions: css`
    display: flex;
    align-items: center;
    scale: 1.5;
    color: ${accentColors.colorNeutralBorderHover} !important;
    margin-right: 0.5rem !important;

    &:hover {
      cursor: pointer;
    }
  `,
};
