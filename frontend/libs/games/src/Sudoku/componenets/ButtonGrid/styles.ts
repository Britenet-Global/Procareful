import { createStyles } from 'antd-style';
import { globalStyles } from '@Procareful/ui';

const { themeColors, fontSizes } = globalStyles;

export const useStyles = createStyles(({ css }) => ({
  mainContainer: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 2rem;
  `,
  container: css`
    padding-top: 4rem;
  `,
  buttonLine: css`
    display: flex !important;
    justify-content: center !important;
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
    font-size: ${fontSizes.fontSizeSM} !important;
  `,
}));
