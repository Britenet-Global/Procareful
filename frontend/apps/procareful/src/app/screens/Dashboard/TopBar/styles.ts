import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

const enlargeFontSize = (size: number, val: number) => `${(size + val) / 10}rem`;

export const useStyles = createStyles(({ css, token }) => ({
  topBar: css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 2.4rem;
    margin-bottom: 4.4rem;
  `,
  topBarElement: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    height: 4.4rem;
  `,
  wrapper: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(50% + 3rem);
  `,
  topBarText: css`
    font-size: ${enlargeFontSize(token.fontSize, 4)} !important;
  `,
  brainLogo: css`
    width: 2.6rem !important;
    height: 2.6rem !important;
  `,
  trophyIcon: css`
    width: 3rem !important;
    height: 3rem !important;
    color: ${globalStyles.themeColors.colorWarning};
  `,
  settingsIcon: css`
    width: 3rem !important;
    height: 3rem !important;
    color: ${globalStyles.themeColors.colorTextHeading};
  `,
  link: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
}));
