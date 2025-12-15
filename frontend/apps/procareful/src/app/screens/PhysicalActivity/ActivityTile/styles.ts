import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  card: css`
    width: 100%;
    height: auto;
    padding: 1rem 1.6rem;
    border-radius: 0.8rem;
    box-shadow: ${globalStyles.containerBoxShadow};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.6rem;
    background-color: ${globalStyles.themeColors.colorBgContainer};
    margin-top: 0.8rem;
  `,
  singleLinePadding: css`
    padding-block: 2rem !important;
  `,
  sideContainer: css`
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  textContainer: css`
    display: flex;
    flex-direction: column;
    margin-right: 0.5rem;
    gap: 0.4rem;
  `,
  completedContainer: css`
    display: flex;
    align-items: center;
  `,
  checkIcon: css`
    font-size: 1.6rem;
    margin-left: 0.4rem;
    color: ${globalStyles.themeColors.colorPrimaryHover};
  `,
  imageWrapper: css`
    cursor: pointer;
    padding: 0 0.5rem;
  `,
  icon: css`
    font-size: 2.9rem !important;
    color: ${globalStyles.accentColors.colorNeutralActive};
  `,
}));
