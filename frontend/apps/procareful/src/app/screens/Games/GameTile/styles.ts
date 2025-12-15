import { globalStyles } from '@Procareful/ui';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  card: css`
    width: 100%;
    height: auto;
    padding: 1.7rem 1rem;
    border-radius: 0.8rem;
    box-shadow: ${globalStyles.containerBoxShadow};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.6rem;
    background-color: ${globalStyles.themeColors.colorBgContainer};
    margin-top: 1rem;
  `,
  container: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    gap: 0.4rem;
  `,
  disabled: css`
    background-color: #f9f9f9;
    pointer-events: none;
    opacity: 0.6;
  `,
  imageWrapper: css`
    padding: 0 0.5rem;

    & > svg {
      font-size: 4rem;
      width: 3rem;
      height: 4rem;
      color: ${globalStyles.accentColors.colorNeutralTextActive};
    }
  `,
}));
