import { globalStyles } from '@Procareful/ui';
import { createStyles, css } from 'antd-style';

export const styles = {
  icon: css`
    min-width: 2.4rem !important;
    width: 2.4rem !important;
    height: 2.4rem !important;
  `,
  purple: css`
    color: #653cad;
  `,
  blue: css`
    color: #62b0e8;
  `,
};

export const useStyles = createStyles(({ css, token }) => ({
  card: css`
    width: 100%;
    height: auto;
    padding: 1.6rem;
    border-radius: 0.8rem;
    box-shadow: ${globalStyles.containerBoxShadow};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.6rem;
    background-color: ${globalStyles.themeColors.colorBgContainer};
    margin-top: 0.8rem;
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
  description: css`
    overflow: hidden;
    display: box;
    box-orient: vertical;
    line-clamp: 2;
  `,
  circularProgress: css`
    font-weight: 700 !important;

    .ant-progress-text {
      font-size: ${token.fontSize};
      line-height: 1.2;
    }
  `,
}));
