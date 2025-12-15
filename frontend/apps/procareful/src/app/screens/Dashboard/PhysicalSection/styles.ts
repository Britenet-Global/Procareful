import { globalStyles } from '@Procareful/ui';
import { createStyles, css } from 'antd-style';

export const styles = {
  tilesContainer: css`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    cursor: pointer;
  `,
};

export const useStyles = createStyles(({ css }) => ({
  container: css`
    margin: 2.4rem 0 0;
  `,
  header: css`
    width: 100%;
    margin-bottom: 0.8rem;
  `,
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
  `,
  headIcon: css`
    width: 2.4rem !important;
    height: 2.4rem !important;
  `,
  textContainer: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  `,
  tileWrapper: css`
    cursor: pointer;
  `,
}));
