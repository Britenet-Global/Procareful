import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

export const useStyles = createStyles(({ css }) => ({
  singleButton: css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 7rem;
    width: 4.8rem;
    padding: 1.2rem !important;
    border-radius: 0.6rem !important;
    border: unset !important;
    box-shadow: ${globalStyles.containerBoxShadow} !important;

    &:hover {
      background: ${globalStyles.accentColors.colorNeutralBorder} !important;
    }
  `,
  label: css`
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: ${globalStyles.fontSizes.fontSizeXL} !important;
  `,
  remainingNumberLabel: css`
    font-size: ${globalStyles.fontSizes.fontSizeSM} !important;
  `,
}));
