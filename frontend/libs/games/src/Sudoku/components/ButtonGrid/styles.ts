import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { themeColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    width: min(90vw, 55rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 2rem;
    padding: 2rem;
  `,
  container: css`
    display: flex;
    flex-direction: column;
    gap: 2rem;
  `,
  buttonLine: css`
    display: flex !important;
    justify-content: center !important;
    gap: 2rem;
  `,
  configButton: css`
    display: flex !important;
    flex-direction: row !important;
    width: 16.1rem;
    height: 4.8rem;
  `,
  labelConfigButton: css`
    font-size: 1.2rem !important;
    font-weight: normal !important;
  `,
  clearIcon: css`
    margin-right: 0.8rem;

    & svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  `,
  checkIcon: css`
    margin-right: 0.8rem;
    color: ${themeColors.colorSuccessActive};

    & svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  `,
  textButton: css`
    text-align: center;
    font-size: ${fontSizes.fontSizeLG} !important;
  `,
}));
