import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { colorNeutralBorder, colorNeutralText } = globalStyles.accentColors;
const { fontSizeSM, fontSizeXL } = globalStyles.fontSizes;

export const useStyles = createStyles(({ css }) => ({
  descriptionContainer: css`
    display: flex;
    align-items: flex-end;
    width: 100%;
    margin-top: 1rem;
  `,
  icon: css`
    color: ${colorNeutralBorder};
    font-size: ${fontSizeXL} !important;
    margin-right: 0.4rem;
  `,
  description: css`
    color: ${colorNeutralText};
    font-size: ${fontSizeSM};
    display: flex;
    align-items: center;
    margin-bottom: 0 !important;
    margin-top: 0.2rem !important;
  `,
}));
